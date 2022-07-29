import { THREE, OrbitControls, MapControls, TransformControls } from './imports.js'

let scene = new THREE.Scene()
let camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000)
let renderer = new THREE.WebGLRenderer({ powerPreference: "high-performance"})
let controls = new MapControls(camera, renderer.domElement)
let startControls = new TransformControls(camera, renderer.domElement)
let targetControls = new TransformControls(camera, renderer.domElement)

var raycaster = new THREE.Raycaster()
var mouse = new THREE.Vector2()
var grid, gui, start, target, meshStart, meshTarget, gui_params
var path = []

document.body.onload = () => {
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    document.getElementById('screen').appendChild(renderer.domElement)

    scene.add(new THREE.AmbientLight(0xffffff, 1))

    const light = new THREE.DirectionalLight( 0xffffff, 0.5 )
    light.position.set( 300, 300, 300 )
    light.castShadow = true
    light.target.position.set(0, 0, 0)
    light.shadow.camera.visible = true
    light.shadow.camera.near = 2
    light.shadow.camera.far = 600
    light.shadow.camera.left = -500
    light.shadow.camera.right = 500
    light.shadow.camera.top = 500
    light.shadow.camera.bottom = -500
    scene.add(light)

    camera.position.set(-300, 200, 120)
    controls.target.set(300, 0, 120)

    init()
}

async function startSearch() {
    if (path != 'failed') {
        for (var i = 0; i < path.length; i++) {
            path[i].mesh.material.color = new THREE.Color(0xCCCCCC)
        }
    }

    path = await findpath(start, target)

    if (path != 'failed') {
        for (var i = 0; i < path.length; i++) {
            path[i].mesh.material.color = new THREE.Color(0xff0033)
        }
    }
}

function init() {
    grid = new Grid(30)
    gui = new dat.GUI()

    gui_params = {
        diagonals: false,
        toggleDiagonals: function() {
            this.diagonals = !this.diagonals
        }
    }

    gui.add(gui_params, 'toggleDiagonals').name('toggleDiagonals')

    startControls.attach(meshStart)
    startControls.addEventListener( 'dragging-changed', function ( event ) {
        controls.enabled = ! event.value
        startSearch()
    })

    startControls.addEventListener('change', function(event) {
        startSearch()
    })

	startControls.showY = false

    targetControls.attach(meshTarget)
    targetControls.addEventListener( 'dragging-changed', function ( event ) {
        controls.enabled = ! event.value
        startSearch()
    })

    targetControls.addEventListener('change', function(event) {
        startSearch()
    })

	targetControls.showY = false

    scene.add(startControls)
    scene.add(targetControls)

    requestAnimationFrame(render)
}

function findpath(startNode, targetNode) {
    
    return new Promise((resolve, reject) => {
        var openNodes = []
        var closedNodes = []

        openNodes.push(startNode)
        
        while (openNodes.length > 0) {
            var currentNode = openNodes[0]
            var currentNodeIndex = 0

            for (var i = 1; i < openNodes.length; i++) {
                if (openNodes[i].fCost < currentNode.fCost || openNodes[i].fCost == currentNode.fCost && openNodes[i].hCost < currentNode.hCost) {
                    currentNode = openNodes[i]
                    currentNodeIndex = i
                }
            }

            openNodes.splice(currentNodeIndex, 1)
            closedNodes.push(currentNode)

            if (currentNode.id == targetNode.id) {
                resolve(retracePath(startNode, targetNode))
            }

            var neighbours = grid.getNeighbours(currentNode)

            for (var i = 0; i < neighbours.length; i++) {
                if (!neighbours[i]) { continue }

                var isClosed = false;
                
                for (var j = 0; j < closedNodes.length; j++) {
                    if (closedNodes[j].id == neighbours[i].id) {
                        isClosed = true
                    }
                }

                if (!neighbours[i].walkable || isClosed) {
                    continue;
                }

                var isOpened = false

                for (var j = 0; j < openNodes.length; j++) {
                    if (openNodes[j].id == neighbours[i].id) {
                        isOpened = true
                    }
                }

                var newMovementCost = currentNode.gCost + currentNode.mesh.position.distanceTo(neighbours[i].mesh.position)

                if (newMovementCost < neighbours[i].gCost || !isOpened) {
                    neighbours[i].gCost = newMovementCost
                    neighbours[i].hCost = neighbours[i].mesh.position.distanceTo(targetNode.mesh.position)
                    neighbours[i].fCost = neighbours[i].gCost + neighbours[i].hCost
                    neighbours[i].parent = currentNode

                    if (!isOpened) {
                        openNodes.push(neighbours[i])
                    }
                }
            }
        }

        resolve('failed')
    })
}

function retracePath(startNode, endNode) {
    var path = []
    var currentNode = endNode

    while (currentNode.id != startNode.id) {
        path.push(currentNode)

        currentNode = currentNode.parent
    }

    return path.reverse()
}

function getNodeFromPos(pos) {
    var min = Infinity
    var node

    for (var i = 0; i < grid.nodes.length; i++) {
        if (!grid.nodes[i].walkable) { continue }
        
        var dist = grid.nodes[i].mesh.position.distanceTo(pos)

        if (dist < min) {
            min = dist
            node = grid.nodes[i]
        }
    }

    return node
}

function render() {
    requestAnimationFrame(render)

    start = getNodeFromPos(meshStart.position)
    target = getNodeFromPos(meshTarget.position)

    controls.update()

    TWEEN.update()

    renderer.render(scene, camera)
}

class Node {
    constructor(w, x, y, z, f, g, h, id) {
        this.walkable = w
        this.mesh = new THREE.Mesh(new THREE.BoxGeometry(10, 1, 10), new THREE.MeshLambertMaterial({ color: (w ? 0xCCCCCC : 0x333333) }))
        this.mesh.position.set(x, y, z)
        this.mesh.nodeId = id
        this.fCost = f
        this.gCost = g
        this.hCost = h
        this.id = id
        this.parent

        scene.add(this.mesh)
    }
}

class Grid {
    constructor(size) {
        this.size = size
        this.nodes = []

        for (var i = 0; i < size; i++) {
            for (var j = 0; j < size; j++) {
                var isWalkable = Math.random() > 0.3
                var node = new Node(
                    isWalkable,
                    i * 10,
                    0,
                    j * 10,
                    0,
                    0,
                    0,
                    this.nodes.length
                )

                if (!isWalkable) {
                    node.mesh.scale.y = 10
                    node.mesh.position.y += 5
                    node.mesh.castShadow = true
                }

                else {
                    if (!meshStart) {
                        meshStart = new THREE.Mesh(new THREE.BoxGeometry(5, 5, 5), new THREE.MeshLambertMaterial({ color: 0x00ff00 }))
                        meshStart.position.x = i * 10
                        meshStart.position.y += 5
                        meshStart.position.z = j * 10
                        scene.add(meshStart)
                    }

                    else if (!meshTarget) {
                        meshTarget = new THREE.Mesh(new THREE.BoxGeometry(5, 5, 5), new THREE.MeshLambertMaterial({ color: 0xff00ff }))
                        meshTarget.position.x = i * 10
                        meshTarget.position.y += 5
                        meshTarget.position.z = j * 10
                        scene.add(meshTarget)
                    }
                }

                node.mesh.receiveShadow = true

                this.nodes.push(node)
            }
        }

        this.getNeighbours = function(n) {
            var neighbours = []

            neighbours.push(grid.nodes[n.id + 1])
            neighbours.push(grid.nodes[n.id - 1])
            neighbours.push(grid.nodes[n.id + grid.size])
            neighbours.push(grid.nodes[n.id - grid.size])

            if (gui_params.diagonals) {
                neighbours.push(grid.nodes[n.id + grid.size + 1])
                neighbours.push(grid.nodes[n.id - grid.size - 1])
                neighbours.push(grid.nodes[n.id + grid.size - 1])
                neighbours.push(grid.nodes[n.id - grid.size + 1])
            }

            for (var i = 0; i < neighbours.length; i++) {
                if (!neighbours[i]) { continue }
                if (!neighbours[i].walkable) { continue }
            }

            return neighbours
        }
    }
}