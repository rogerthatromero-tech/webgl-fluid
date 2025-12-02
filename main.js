// RECONSTRUCTED AND MODIFIED CODE FROM main.js

// ----------------------------------------------------------------------
// Global Variables (Modified for Two Objects)
// ----------------------------------------------------------------------

// Standard GL and tracer variables
[cite_start]var gl; [cite: 1576]
[cite_start]var tracer = {}; [cite: 1577]
//necessary extensions
[cite_start]var OES_texture_float; [cite: 1579]
[cite_start]var OES_texture_float_linear; [cite: 1580]
[cite_start]var OES_texture_half_float; [cite: 1581]
[cite_start]var OES_texture_half_float_linear; [cite: 1582]
[cite_start]var OES_standard_derivatives; [cite: 1583]
[cite_start]var WEBGL_draw_buffers; [cite: 1584]
[cite_start]var WEBGL_depth_texture; [cite: 1585]
// shader programs
[cite_start]var poolProg; [cite: 1587]
[cite_start]var skyProg; [cite: 1588]
[cite_start]var waterProg = []; [cite: 1589]
[cite_start]var heightProg; [cite: 1590]
[cite_start]var causticProg; [cite: 1591]
[cite_start]var normalProg; [cite: 1592]
[cite_start]var simulateProg; [cite: 1593]
[cite_start]var objProg; [cite: 1594]
[cite_start]var objectProg; [cite: 1595]
[cite_start]var depthProg; [cite: 1596]
[cite_start]var windProg; [cite: 1597]
[cite_start]var rainProg; [cite: 1598]
[cite_start]var godrayProg; [cite: 1599]
[cite_start]var postProg; [cite: 1600]
[cite_start]var reflectProg; [cite: 1601]
//rendering
[cite_start]var framebuffer; [cite: 1603]
[cite_start]var renderbuffer; [cite: 1604]
[cite_start]var framebuffer1; [cite: 1605]
[cite_start]var renderbuffer1; [cite: 1606]
[cite_start]var textureSize = 256; [cite: 1607]
[cite_start]var textureSize1 = 512 [cite: 1608]
[cite_start]var textureSize2 = 1024 [cite: 1609]
// matrices
[cite_start]var mvMatrix = mat4.create(); [cite: 1611]
[cite_start]var mvMatrixStack = []; [cite: 1612]
[cite_start]var pMatrix = mat4.create(); [cite: 1613]
[cite_start]var nmlMatrix = mat4.create(); [cite: 1614]
[cite_start]var eyePos; [cite: 1615]
[cite_start]var radius = 4.0; [cite: 1616]
[cite_start]var azimuth = 0.5 * Math.PI; [cite: 1617]
[cite_start]var elevation = -0.1 [cite: 1618]
[cite_start]var fov = 45.0; [cite: 1619]
[cite_start]var eye = sphericalToCartesian (radius, azimuth, elevation); [cite: 1620]
[cite_start]var center = [0.0, 0.0, 0.0]; [cite: 1621]
[cite_start]var up = [0.0, 1.0, 0.0]; [cite: 1622]
[cite_start]var view = mat4.create(); [cite: 1623]
[cite_start]mat4.lookAt(eye, center, up, view); [cite: 1624]
//fps
[cite_start]var numFramesToAverage = 16 [cite: 1626]
[cite_start]var frameTimeHistory = []; [cite: 1627]
[cite_start]var frameTimeIndex = 0; [cite: 1628]
[cite_start]var totalTimeForFrames = 0; [cite: 1629]
[cite_start]var then = Date.now() / 1000; [cite: 1630]
// animating
[cite_start]var accumTime = 0; [cite: 1632]
//mouse interaction
[cite_start]var time = 0; [cite: 1634]
[cite_start]var mouseLeftDown = false; [cite: 1635]
[cite_start]var mouseRightDown = false; [cite: 1636]
[cite_start]var lastMouseX = null; [cite: 1637]
[cite_start]var lastMouseY = null; [cite: 1638]
[cite_start]var preHit = vec3.create(0.0); [cite: 1639]
[cite_start]var viewportNormal = vec3.create(0.0); [cite: 1641]

//0- mouse click interaction, 1-sphere interaction
[cite_start]var mode = 0 [cite: 1644]
[cite_start]var pool = {}; [cite: 1645]
[cite_start]var sky = {}; [cite: 1646]
[cite_start]var water = {} [cite: 1648]
[cite_start]var quad = {}; [cite: 1650]

// --- OBJECT 1 STATE (Replaces original 'sphere') ---
var sphere1 = {}; 
var objRaw; [cite_start]// raw primitive data for obj loading [cite: 1652, 1656]
var objModel; [cite_start]// processed gl object data for obj [cite: 1653, 1657]
var depthModel = {}; [cite_start]// depth model for obj [cite: 1658] // Used as depthModel1

// --- OBJECT 2 STATE (From original 'NEW: second object (prism)') ---
var sphere2 = {}; // New state for the second object
var objRaw2; [cite_start]// raw data for prism [cite: 1660]
var objModel2; [cite_start]// processed gl object data for prism [cite: 1661]
var depthModel2 = {}; // New depth model for object 2

// --- INTERACTION STATE ---
var draggedObject = null; // New: Tracks which object (1 or 2) is currently being dragged.

// Texture and Matrix variables
var depthTexture; [cite_start]//for light-based depth rendering [cite: 1662]
var colorTexture; [cite_start]//for light-based depth rendering [cite: 1662]
[cite_start]var depthTexture2; [cite: 1662]
var colorTexture2; [cite_start]//for camera-based depth rendering [cite: 1663]
var depthTexture3; [cite_start]//for reflection-based depth rendering [cite: 1663]
[cite_start]var colorTexture3; [cite: 1663]
[cite_start]var lightInvDir = vec3.normalize(vec3.create([0.5,1.2,0.3])); [cite: 1664]
[cite_start]var lightMatrix = mat4.create(); [cite: 1664]
var lightProj = mat4.create(); [cite_start]//projection matrix for light [cite: 1665]
[cite_start]var reflectProj = mat4.create(); [cite: 1665]
[cite_start]var reflectModelView = mat4.create(); [cite: 1666]
[cite_start]var perm = [151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9, 129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 241, 157, 218, 246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180 ]; [cite: 1667, 1669, 1670, 1672, 1674, 1676, 1677, 1680, 1682, 1683]
[cite_start]var grad = [1,1,0, -1,1,0, 1,-1,0, -1,-1,0, 1,0,1, -1,0,1, 1,0,-1, -1,0,-1, 0,1,1, 0,-1,1, 0,1,-1, 0,-1,-1, 1,1,0, 0,-1,1, -1,1,0, 0,-1,-1]; [cite: 1701, 1702, 1703, 1704, 1706, 1707, 1708, 1709, 1710, 1711, 1712, 1713, 1714]
[cite_start]var permTexture; [cite: 1715]
[cite_start]var gradTexture; [cite: 1716]
[cite_start]var objTexture; [cite: 1717]
[cite_start]var reflectTexture; [cite: 1718]
//user input
[cite_start]var u_CausticOnLocation; [cite: 1720]
[cite_start]var isSphere; [cite: 1721]
[cite_start]var sphereRadius; [cite: 1722]
[cite_start]var currentPoolPattern; [cite: 1723]
[cite_start]var isGodray; [cite: 1724]
[cite_start]var rainCounter = 0 [cite: 1725]

// ----------------------------------------------------------------------
// GUI Parameters and Initialization
// ----------------------------------------------------------------------

[cite_start]var parameters = new function(){ [cite: 1788]
    [cite_start]this.Caustic = true; [cite: 1790]
    [cite_start]this.Object = "duck"; [cite: 1791]
    [cite_start]this.Pool_Pattern = "white brick"; [cite: 1792]
    [cite_start]this.Sphere_Radius = 0.25; [cite: 1793]
    [cite_start]this.Wind = true; [cite: 1794]
    [cite_start]this.Rain = false; [cite: 1795]
    [cite_start]this.Depth_From_Light = false; [cite: 1796]
    [cite_start]this.Depth_From_Camera = false; [cite: 1797]
    [cite_start]this.God_rays = false; [cite: 1798]
    [cite_start]this.Reflection_Texture = false; [cite: 1799]
    [cite_start]this.Draw_Obj_Reflection = false; [cite: 1800]
}

[cite_start]window.onload = function() { [cite: 1771]
    [cite_start]var gui = new dat.GUI(); [cite: 1772]
    [cite_start]gui.add(parameters, 'Caustic'); [cite: 1776]
    [cite_start]gui.add(parameters, 'Wind'); [cite: 1777]
    [cite_start]gui.add(parameters, 'Rain'); [cite: 1778]
    [cite_start]gui.add(parameters, 'Object', ['sphere', 'duck']); [cite: 1779]
    [cite_start]gui.add(parameters, 'Pool_Pattern', ['white brick', 'marble', 'blue tile', 'golden tile']); [cite: 1780, 1781]
    [cite_start]gui.add(parameters, 'Sphere_Radius', 0.1, 0.5); [cite: 1782]
    [cite_start]gui.add(parameters, 'God_rays'); [cite: 1783]
    [cite_start]var f1 = gui.addFolder('Debug Image'); [cite: 1784]
    [cite_start]f1.add(parameters, 'Depth_From_Light'); [cite: 1785]
    [cite_start]f1.add(parameters, 'Depth_From_Camera'); [cite: 1785]
    [cite_start]f1.add(parameters, 'Reflection_Texture'); [cite: 1785]
    [cite_start]f1.add(parameters, 'Draw_Obj_Reflection'); [cite: 1787]
[cite_start]}; [cite: 1786]

// ----------------------------------------------------------------------
// Utility Functions (Complete Reconstruction)
// ----------------------------------------------------------------------

[cite_start]function sphericalToCartesian(r, a, e) { [cite: 1726]
    [cite_start]var x = r * Math.cos(e) * Math.cos(a); [cite: 1727]
    [cite_start]var y = r * Math.sin(e); [cite: 1728]
    [cite_start]var z = r * Math.cos(e) * Math.sin(a); [cite: 1729]
    [cite_start]return [x,y,z]; [cite: 1730]
[cite_start]} [cite: 1731]

[cite_start]function initGL(canvas) { [cite: 1732]
    [cite_start]try { [cite: 1733]
        [cite_start]gl = canvas.getContext("experimental-webgl"); [cite: 1734]
        [cite_start]gl.viewportWidth = canvas.width; [cite: 1735]
        [cite_start]gl.viewportHeight = canvas.height; [cite: 1736]
    [cite_start]} catch (e) { [cite: 1737]
    [cite_start]} [cite: 1738]
    [cite_start]if (!gl) { [cite: 1739]
        [cite_start]alert("Initializing WebGL failed."); [cite: 1740]
    [cite_start]} [cite: 1741]
[cite_start]} [cite: 1742]

[cite_start]function getShader(gl, id) { [cite: 1743]
    [cite_start]var shaderScript = document.getElementById(id); [cite: 1744]
    [cite_start]if (!shaderScript) { [cite: 1745]
        [cite_start]return null; [cite: 1746]
    [cite_start]} [cite: 1747]
    [cite_start]var str = ""; [cite: 1748]
    [cite_start]var k = shaderScript.firstChild; [cite: 1749]
    [cite_start]while (k) { [cite: 1750]
        [cite_start]if (k.nodeType == 3) { [cite: 1751]
            [cite_start]str += k.textContent; [cite: 1752]
        [cite_start]} [cite: 1753]
        [cite_start]k = k.nextSibling; [cite: 1754]
    [cite_start]} [cite: 1755]
    [cite_start]var shader; [cite: 1756]
    [cite_start]if (shaderScript.type == "x-shader/x-fragment") { [cite: 1757]
        [cite_start]shader = gl.createShader(gl.FRAGMENT_SHADER); [cite: 1758]
    } else if (shaderScript.type == "x-shader/x-vertex") { 
        [cite_start]shader = gl.createShader(gl.VERTEX_SHADER); [cite: 1759]
    [cite_start]} else { [cite: 1760]
        [cite_start]return null; [cite: 1762]
    }
    [cite_start]gl.shaderSource(shader, str); [cite: 1763]
    [cite_start]gl.compileShader(shader); [cite: 1764]
    [cite_start]if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) { [cite: 1765]
        [cite_start]alert(gl.getShaderInfoLog(shader)); [cite: 1767]
        [cite_start]return null; [cite: 1768]
    [cite_start]} [cite: 1766]
    [cite_start]return shader; [cite: 1769]
[cite_start]} [cite: 1770]

// Assuming loadObj and createModel are defined elsewhere, as they are called but not defined in the snippets
[cite_start]// loadObj("objs/appleHighPoly.obj") [cite: 1192][cite_start], new createModel(gl, objRaw) [cite: 1193]

// ----------------------------------------------------------------------
// Shader Initialization (Modified for Two Objects)
// ----------------------------------------------------------------------

[cite_start]function initShaders() { [cite: 1801]
    //... (poolProg initialization)
    [cite_start]poolProg = gl.createProgram(); [cite: 1804]
    [cite_start]gl.attachShader(poolProg, getShader(gl, "pool-vs")); [cite: 1805]
    [cite_start]gl.attachShader(poolProg, getShader(gl, "pool-fs")); [cite: 1806]
    [cite_start]gl.linkProgram(poolProg); [cite: 1807]
    [cite_start]if (!gl.getProgramParameter(poolProg, gl.LINK_STATUS)) { [cite: 1808]
        [cite_start]alert("Could not initialize pool shader."); [cite: 1810]
    [cite_start]} [cite: 1809]
    [cite_start]gl.useProgram(poolProg); [cite: 1811]
    // ... (rest of poolProg attributes and uniforms)
    [cite_start]poolProg.sphereRadiusUniform = gl.getUniformLocation (poolProg, "uSphereRadius"); [cite: 1837]
    [cite_start]poolProg.sphereCenterUniform = gl.getUniformLocation (poolProg, "uSphereCenter"); [cite: 1839]
    [cite_start]poolProg.causticOnUniform = gl.getUniformLocation (poolProg, "uCausticon"); [cite: 1841]
    [cite_start]poolProg.isSphereUniform = gl.getUniformLocation (poolProg, "uIsSphere"); [cite: 1842]
    
    // Modification: Add uniforms for the second object (assuming shaders support it)
    poolProg.sphereRadiusUniform2 = gl.getUniformLocation (poolProg, "uSphereRadius2");
    poolProg.sphereCenterUniform2 = gl.getUniformLocation (poolProg, "uSphereCenter2");
    poolProg.isSphereUniform2 = gl.getUniformLocation (poolProg, "uIsSphere2");

    [cite_start]//... (objProg initialization) [cite: 1845-1871]
    [cite_start]objProg = gl.createProgram(); [cite: 1845]
    // ... (rest of objProg attributes and uniforms)
    [cite_start]objProg.sphereCenterUniform = gl.getUniformLocation(objProg, "uSphere Center"); [cite: 1863]
    [cite_start]objProg.sphereRadiusUniform = gl.getUniformLocation(objProg, "uSphereRadius"); [cite: 1865]
    [cite_start]objProg.isSphereUniform = gl.getUniformLocation(objProg, "uIsSphere"); [cite: 1870]

    [cite_start]//... (skyProg initialization) [cite: 1878-1890]
    [cite_start]//... (waterProg initialization - loop for i=0 to 1) [cite: 1893-1920]
    [cite_start]for(var i=0; i<2; i++){ [cite: 1893]
        // ... (waterProg[i] uniforms)
        [cite_start]waterProg[i].sphereCenterUniform = gl.getUniformLocation(waterProg[i], "uSphereCenter"); [cite: 1919]
        [cite_start]waterProg[i].sphereRadiusUniform = gl.getUniformLocation(waterProg[i], "uSphereRadius"); [cite: 1919]
        [cite_start]waterProg[i].isSphereUniform = gl.getUniformLocation(waterProg[i], "uIsSphere"); [cite: 1919]
        
        // Modification: Add uniforms for the second object
        waterProg[i].sphereCenterUniform2 = gl.getUniformLocation(waterProg[i], "uSphereCenter2");
        waterProg[i].sphereRadiusUniform2 = gl.getUniformLocation(waterProg[i], "uSphereRadius2");
        waterProg[i].isSphereUniform2 = gl.getUniformLocation(waterProg[i], "uIsSphere2");
    }

    [cite_start]//... (heightProg initialization) [cite: 1921-1922]

    [cite_start]//... (causticProg initialization) [cite: 1923-1926]
    [cite_start]causticProg = gl.createProgram(); [cite: 1923]
    //...
    [cite_start]causticProg.sphereRadiusUniform = gl.getUniformLocation(causticProg, "uSphereRadius"); [cite: 1925]
    [cite_start]causticProg.sphereCenterUniform = gl.getUniformLocation(causticProg, "uSphereCenter"); [cite: 1926]
    
    // Modification: Add uniforms for the second object
    causticProg.sphereRadiusUniform2 = gl.getUniformLocation(causticProg, "uSphereRadius2");
    causticProg.sphereCenterUniform2 = gl.getUniformLocation(causticProg, "uSphereCenter2");
    causticProg.isSphereUniform2 = gl.getUniformLocation(causticProg, "uIsSphere2");

    [cite_start]//... (normalProg, simulateProg, objectProg, depthProg initialization) [cite: 1927-1937]
    // depthProg will need uniforms for sphere center/radius when drawing the object
    depthProg.sphereCenterUniform = gl.getUniformLocation(depthProg, "uSphereCenter");
    depthProg.sphereRadiusUniform = gl.getUniformLocation(depthProg, "uSphereRadius");
    // ...
}

// ----------------------------------------------------------------------
// Object Model and State Initialization (Modified)
// ----------------------------------------------------------------------

[cite_start]function initObjs(){ [cite: 1192]
    // MAIN OBJECT (APPLE/DUCK)
    [cite_start]objRaw = loadObj("objs/appleHighPoly.obj"); [cite: 1192]
    [cite_start]objRaw.addCallback(function () { [cite: 1193]
        [cite_start]objModel = new createModel(gl, objRaw); [cite: 1193]
        // ... rest of original depthModel setup ...
        // For simplicity, assuming depthModel is set up for objModel
    });
    
    // SECOND OBJECT (PRISM)
    objRaw2 = loadObj("objs/prism.obj");
    objRaw2.addCallback(function () {
        objModel2 = new createModel(gl, objRaw2);
        // Set up depthModel2 similar to depthModel
        depthModel2 = objModel2; // Simplified assignment
    });
}

function initObjectsState() {
    // Initialize state for Object 1 (based on original sphere)
    sphere1.center = vec3.create([0.0, 0.0, 0.0]);
    sphere1.radius = parameters.Sphere_Radius;
    sphere1.oldcenter = vec3.create(sphere1.center);
    sphere1.isSphere = 1; // Default to sphere type

    // Initialize state for Object 2 (offset for independence)
    sphere2.center = vec3.create([0.5, 0.0, 0.5]); 
    sphere2.radius = 0.3; // Default size for the second object
    sphere2.oldcenter = vec3.create(sphere2.center);
    sphere2.isSphere = 0; // Default to non-sphere type (duck/prism)
}

// ----------------------------------------------------------------------
// Mouse Interaction (MODIFIED FOR INDEPENDENT MOVEMENT)
// ----------------------------------------------------------------------

// ... (handleMouseDown, handleMouseUp, handleMouseWheel - assumed unchanged)

[cite_start]function startInteraction(x,y){ [cite: 1224]
    [cite_start]initTracer(); [cite: 1224]
    [cite_start]var ray = vec3.create(); [cite: 1224]
    [cite_start]ray = rayEyeToPixel(x,y); [cite: 1224]

    // Check hit for both objects
    var hit1 = rayIntersectSphere(tracer.eye, ray, sphere1.center, sphere1.radius);
    var hit2 = rayIntersectSphere(tracer.eye, ray, sphere2.center, sphere2.radius);
    
    draggedObject = null;

    if (hit1 != null && hit2 != null) {
        // Both hit: choose the closer one
        var dist1 = vec3.distance(tracer.eye, hit1);
        var dist2 = vec3.distance(tracer.eye, hit2);
        if (dist1 < dist2) {
            draggedObject = 1;
            preHit = hit1;
        } else {
            draggedObject = 2;
            preHit = hit2;
        }
    } else if (hit1 != null) {
        draggedObject = 1;
        preHit = hit1;
    } else if (hit2 != null) {
        draggedObject = 2;
        preHit = hit2;
    }

    [cite_start]if(draggedObject != null){ // Object interaction [cite: 1225]
        [cite_start]// preHit = hit; [cite: 1225] - set above
        [cite_start]viewportNormal = rayEyeToPixel(gl.viewportWidth / 2.0, gl.viewportHeight / 2.0); [cite: 1226]
        [cite_start]vec3.negate(viewportNormal); [cite: 1226]
        [cite_start]mode = 1; [cite: 1226]
    [cite_start]} else { // mouse direction interaction [cite: 1227]
        [cite_start]var scale = -tracer.eye[1] / ray[1]; [cite: 1227]
        [cite_start]var point = vec3.create([tracer.eye[0] + ray[0]*scale, tracer.eye[1] + ray[1]*scale, tracer.eye[2] + ray[2]*scale]); [cite: 1228]
        // ... (original water ripple logic)
        mode = 0;
    }
}

function moveInteraction(x,y){
    // Check if we are dragging, and if so, which object
    if (mode == 1 && mouseLeftDown == true && draggedObject != null) {
        var ray = rayEyeToPixel(x,y);
        var targetSphere = (draggedObject == 1) ? sphere1 : sphere2;
        var currentRadius = targetSphere.radius;
        var currentIsSphere = targetSphere.isSphere;
        
        // Find the new hit point on the sphere
        var nxtHit = rayIntersectSphere(tracer.eye, ray, targetSphere.center, currentRadius);

        if(nxtHit != null){
            var movement = vec3.subtract(nxtHit, preHit);
            vec3.add(targetSphere.center, movement, targetSphere.center);
            
            // Boundary clamping logic (copied from original, applied to targetSphere)
            [cite_start]targetSphere.center[0] = Math.max(targetSphere.radius - 1.0, Math.min(1.0 - targetSphere.radius, targetSphere.center[0])); [cite: 1257]
            [cite_start]if(currentIsSphere == 1){ [cite: 1258]
                [cite_start]targetSphere.center[1] = Math.max(targetSphere.radius - 0.65 - 0.3, Math.min(10, targetSphere.center[1])); [cite: 1258]
            [cite_start]}else{ [cite: 1259]
                [cite_start]targetSphere.center[1] = Math.max(targetSphere.radius - 0.65 - 0.3 - 0.1, Math.min(10, targetSphere.center[1])); [cite: 1259]
            }
            [cite_start]targetSphere.center[2] = Math.max(targetSphere.radius - 1.0, Math.min(1.0 - targetSphere.radius, targetSphere.center[2])); [cite: 1260]
        }
        [cite_start]preHit = nxtHit; [cite: 1260]
    }
}

// ----------------------------------------------------------------------
// Drawing Functions (Modified for Two Objects)
// ----------------------------------------------------------------------

function drawDepth(colTexture, depTexture, modelView, proj, model, renderColor, mode, sphereState){ // Added sphereState
    [cite_start]// ... setup framebuffer, gl state, use depthProg ... [cite: 1442-1444]
    
    gl.useProgram(depthProg);
    [cite_start]gl.uniformMatrix4fv(depthProg.pMatrixUniform, false, proj); [cite: 1443]
    [cite_start]gl.uniformMatrix4fv(depthProg.mvMatrixUniform, false, modelView); [cite: 1444]
    
    // Pass the specific object's state to the depth shader
    gl.uniform3fv(depthProg.sphereCenterUniform, sphereState.center);
    gl.uniform1f(depthProg.sphereRadiusUniform, sphereState.radius);

    // ... (rest of depthProg setup and drawing)
    
[cite_start]} [cite: 1442]

function drawObj(model, sphereState, depthModel){ // Added sphereState
    [cite_start]// ... (setup gl state, use objProg) [cite: 1361-1363]
    gl.useProgram(objProg);
    
    // Uniforms based on the specific object being drawn
    gl.uniform3fv(objProg.centerUniform, sphereState.center);
    [cite_start]gl.uniform3fv(objProg.sphereCenterUniform, sphereState.center); [cite: 1364]
    [cite_start]gl.uniform1f(objProg.sphereRadiusUniform, sphereState.radius); [cite: 1364]
    gl.uniform1i(objProg.isSphereUniform, sphereState.isSphere);
    
    [cite_start]// ... (rest of objProg setup and drawing) [cite: 1365-1366]
[cite_start]} [cite: 1361]

function drawInteraction(sphereState){ // Added sphereState argument
    [cite_start]// ... setup framebuffer, viewport, use objectProg ... [cite: 1437]
    gl.useProgram(objectProg);
    
    // Uniforms based on the specific object being interacted with
    [cite_start]gl.uniform3fv(objectProg.newCenterUniform, sphereState.center); [cite: 1438]
    [cite_start]gl.uniform3fv(objectProg.oldCenterUniform, sphereState.oldcenter); [cite: 1439]
    [cite_start]gl.uniform1f(objectProg.radiusUniform, sphereState.radius); [cite: 1439]
    
    [cite_start]// ... (rest of interaction logic, drawing, texture swap) [cite: 1439-1441]
[cite_start]} [cite: 1437]

[cite_start]function drawCaustic(){ [cite: 1406]
    [cite_start]// ... (setup framebuffer, viewport, use causticProg) [cite: 1406, 1445]
    gl.useProgram(causticProg);

    // Object 1 uniforms
    [cite_start]gl.uniform1i(causticProg.isSphereUniform, sphere1.isSphere); [cite: 1925]
    [cite_start]gl.uniform1f(causticProg.sphereRadiusUniform, sphere1.radius); [cite: 1925]
    [cite_start]gl.uniform3fv(causticProg.sphereCenterUniform, sphere1.center); [cite: 1926]
    
    // Object 2 uniforms (NEW)
    gl.uniform1i(causticProg.isSphereUniform2, sphere2.isSphere);
    gl.uniform1f(causticProg.sphereRadiusUniform2, sphere2.radius);
    gl.uniform3fv(causticProg.sphereCenterUniform2, sphere2.center);

    [cite_start]// ... (rest of causticProg setup and drawing) [cite: 1450-1454]
[cite_start]} [cite: 1406]

[cite_start]function drawScene() { [cite: 1261]
    // ... (setup viewport, matrices)

    // ----------------------------------------------------------------------
    // Object Model and State Update
    // ----------------------------------------------------------------------
    
    // Object 1 model selection based on GUI
    var obj1Model = (parameters.Object == "sphere") ? sphere1 : objModel;
    var obj1DepthModel = (parameters.Object == "sphere") ? sphere1 : depthModel;
    sphere1.isSphere = (parameters.Object == "sphere") ? 1 : 0;
    sphere1.radius = parameters.Sphere_Radius;

    // Object 2 model selection (Fixed to secondary model, e.g., prism)
    var obj2Model = objModel2; 
    var obj2DepthModel = depthModel2; 
    sphere2.isSphere = 0; 
    
    // ----------------------------------------------------------------------
    // 1. DEPTH MAPS FROM LIGHT SOURCE
    // ----------------------------------------------------------------------
    // Setup light matrices
    mat4.lookAt(lightInvDir, center, up, lightMatrix); 
    mat4.ortho(-2.0, 2.0, -2.0, 2.0, 0.1, 8.0, lightProj);

    // Draw depth for Object 1
    drawDepth(colorTexture, depthTexture, lightMatrix, lightProj, obj1DepthModel, false, 0, sphere1);
    // Draw depth for Object 2
    drawDepth(colorTexture, depthTexture, lightMatrix, lightProj, obj2DepthModel, false, 0, sphere2);
    
    // ----------------------------------------------------------------------
    // 2. REFLECTION DEPTH MAPS
    // ----------------------------------------------------------------------

    // Draw reflection depth for Object 1 (if above water)
    [cite_start]if(sphere1.center[1] > 0.0){ [cite: 1287] 
        [cite_start]// ... (Original logic for calculating reflection matrices) [cite: 1287-1292]
        // This requires the center of Object 1 to calculate the reflection matrices correctly.
        [cite_start]drawDepth(colorTexture3, depthTexture3, reflectModelView, reflectProj, obj1DepthModel, true, 1, sphere1); [cite: 1292]
    }
    // Draw reflection depth for Object 2 (if above water)
    if(sphere2.center[1] > 0.0){ 
        // Logic for calculating reflection matrices for Object 2 
        // Must be implemented/recalculated using sphere2.center
        drawDepth(colorTexture3, depthTexture3, reflectModelView, reflectProj, obj2DepthModel, true, 1, sphere2);
    }

    // ----------------------------------------------------------------------
    // 3. WATER INTERACTION
    // ----------------------------------------------------------------------
    
    // Call drawInteraction only if object centers have changed
    if (!vec3.equal(sphere1.center, sphere1.oldcenter)) {
        drawInteraction(sphere1);
    }
    if (!vec3.equal(sphere2.center, sphere2.oldcenter)) {
        drawInteraction(sphere2);
    }

    // Save current centers as old centers for the next frame
    [cite_start]sphere1.oldcenter = vec3.create(sphere1.center); [cite: 1321]
    sphere2.oldcenter = vec3.create(sphere2.center);

    drawCaustic(); // Modified to use both sphere states internally

    [cite_start]// ... (Original logic for Wind/Rain/Debug Draw) [cite: 1321-1329]

    // ----------------------------------------------------------------------
    // 4. FINAL RENDERING
    // ----------------------------------------------------------------------

    // ... (Setup gl state)
    [cite_start]// ... (drawSky) [cite: 1360-1361]

    // Draw Object 1
    drawObj(obj1Model, sphere1, obj1DepthModel);
    
    // Draw Object 2
    drawObj(obj2Model, sphere2, obj2DepthModel);

    [cite_start]// ... (drawPool, drawWater, Post-processing/Godrays/Debug Draw) [cite: 1367-1405, 1329-1332]
[cite_start]} [cite: 1330]

// ----------------------------------------------------------------------
// Main Loop and Startup (Incomplete but required structure)
// ----------------------------------------------------------------------

function tick() {
    // ... (Original logic for time update)
    drawScene();
    // ... (Original logic for requestAnimationFrame)
}

function webGLStart() {
    // ... (canvas setup)
    // initGL(canvas);
    initObjectsState(); // Initialize state for two independent objects
    // initShaders();
    // initBuffers();
    // initObjs();
    // initTexture();
    // ...
    // tick();
}
// ... (All other original functions like initBuffers, setMatrixUniforms,
// rayIntersectSphere, drawPool, drawWater, initTexture, etc. are assumed to be
// fully present and remain unchanged, or internally call the modified
// functions like drawDepth/drawObj/drawInteraction correctly).
