// 360 Image logic
BABYLON.DefaultLoadingScreen.prototype.displayLoadingUI = function () {
    if (document.getElementById("customLoadingScreenDiv")) {
        // Do not add a loading screen if there is already one
        document.getElementById("customLoadingScreenDiv").style.display = "initial";
        return;
    }
    this._loadingDiv = document.createElement("div");
    this._loadingDiv.id = "customLoadingScreenDiv";
    this._loadingDiv.innerHTML = "CL Diode Laser Machine is Currently Loading";
    var customLoadingScreenCss = document.createElement('style');
    customLoadingScreenCss.type = 'text/css';
    customLoadingScreenCss.innerHTML = `
    #customLoadingScreenDiv{
        background-color: #BB464Bcc;
        color: white;
        font-size:50px;
        text-align:center;
    }
    `;
    document.getElementsByTagName('head')[0].appendChild(customLoadingScreenCss);
    this._resizeLoadingUI();
    window.addEventListener("resize", this._resizeLoadingUI);
    document.body.appendChild(this._loadingDiv);
};

BABYLON.DefaultLoadingScreen.prototype.hideLoadingUI = function(){
    document.getElementById("customLoadingScreenDiv").style.display = "none";
    console.log("scene is now loaded");
}



window.addEventListener('DOMContentLoaded', function(){
    var canvas = document.getElementById("renderCanvas");

    var engine = null;
    var scene = null;
    var sceneToRender = null;
    var createDefaultEngine = function() { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true }); };
    
    
    var createScene = async function () {
         engine.displayLoadingUI();
        var pushButtonCore;
        var index = 0; 
    
        var scene = new BABYLON.Scene(engine);
        scene.clearColor = new BABYLON.Color3(1, 1, 0.6);
        var camera = new BABYLON.ArcRotateCamera("cam", Math.PI/2, Math.PI / 2, 3, new BABYLON.Vector3(0,0.5,0));
        var light = new BABYLON.HemisphericLight("sun", new BABYLON.Vector3(0,1,0), scene);
        var anchor = new BABYLON.TransformNode("");
       
        
        camera.wheelDeltaPercentage = 0.01;
        camera.attachControl(canvas, true, false);
        camera.lowerRadiusLimit = 1.5;
        camera.upperRadiusLimit = 5;
        camera.inputs.removeByType('ArcRotateCameraPointersInput');
      
        let chair;
      //  BABYLON.SceneLoader.ImportMesh(
        //  https://www.dropbox.com/s/o5w0nlstfj21202/bDraco.glb?dl=0
        //   "./table.glb",
         //   scene,
        BABYLON.SceneLoader.ImportMesh("", "https://dl.dropbox.com/s/o5w0nlstfj21202/", "bDraco.glb", scene,
            function (mesh) { 
                chair = mesh[0].getChildTransformNodes(false)[0];
               mesh.rotation = new BABYLON.Vector3(0, 180, 0);
                chair.isVisible = false;
             engine.hideLoadingUI();
        });
    
        // var xr = await scene.createDefaultXRExperienceAsync({floorMeshes: []})
        // // default is vr, change to ar
        // xr.enterExitUI["_buttons"][0].sessionMode = "immersive-ar";
        
       
    var xr = await scene.createDefaultXRExperienceAsync({
        uiOptions: {
            sessionMode: "immersive-ar",
        },
        optionalFeatures: true
    });

    const fm = xr.baseExperience.featuresManager;
   
    const hitTest = fm.enableFeature(BABYLON.WebXRHitTest, "latest");

    const anchors = fm.enableFeature(BABYLON.WebXRAnchorSystem.Name, 'latest');

    const marker = BABYLON.MeshBuilder.CreateTorus('marker', { diameter: 0.15, thickness: 0.05 });
    marker.isVisible = false;
    marker.rotationQuaternion = new BABYLON.Quaternion();

    hitTest.onHitTestResultObservable.add((results) => {
        if (results.length) {
            marker.isVisible = true;
            hitPoint = results[0];
            hitPoint.transformationMatrix.decompose(marker.scaling, marker.rotationQuaternion, marker.position);
        } else {
            marker.isVisible = false;
        }
    });

    if (anchors) {
        console.log('anchors attached');
        anchors.onAnchorAddedObservable.add(anchor => {
            console.log('attaching', anchor);
            chair.isVisible = true;
            anchor.attachedNode = chair.clone("mensch");
            chair.isVisible = false;
        })

        anchors.onAnchorRemovedObservable.add(anchor => {
            console.log('disposing', anchor);
            if (anchor) {
                anchor.attachedNode.isVisible = false;
                anchor.attachedNode.dispose();
            }
        });
    }

    scene.onPointerDown = (evt, pickInfo) => {
        if (hitTest && anchors && xr.baseExperience.state === BABYLON.WebXRState.IN_XR) {
            anchors.addAnchorPointUsingHitTestResultAsync(hitPoint);
        }
    }
        
        return scene;
    }
var engine;
try {
engine = createDefaultEngine();
} catch(e) {
console.log("the available createEngine function failed. Creating the default engine instead");
engine = createDefaultEngine();
}
    if (!engine) throw 'engine should not be null.';
    scene = createScene();;
    scene.then(returnedScene => { sceneToRender = returnedScene; });
    

    engine.runRenderLoop(function () {
        if (sceneToRender && sceneToRender.activeCamera) {
            sceneToRender.render();
        }
    });

    // Resize
    window.addEventListener("resize", function () {
        engine.resize();
    });
});
