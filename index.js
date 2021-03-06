<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

    <title>Babylon.js custom loading screen example</title>
    <script src="https://code.jquery.com/pep/0.4.2/pep.min.js"></script>
    <script src="https://preview.babylonjs.com/babylon.js"></script>
    <script src="https://preview.babylonjs.com/loaders/babylonjs.loaders.js"></script>

    <style>
        html,
        body {
            overflow: hidden;
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
        }

        #renderCanvas {
            width: 100%;
            height: 100%;
            touch-action: none;
        }

        #loadingScreen {
            position: absolute;
            width: 100%;
            height: 100%;
            color: white;
            font-size: 50px;
            text-align: center;
            background-color: #BB464Bcc;
            z-index: 9999;
        }
    </style>
</head>

<body>
    <div id="loadingScreen">default div text</div>
    <canvas id="renderCanvas"></canvas>
    <script>
        var canvas = document.getElementById("renderCanvas");
        var engine = new BABYLON.Engine(canvas, true);

        var loadingScreenDiv = window.document.getElementById("loadingScreen");

        function customLoadingScreen() {
            console.log("customLoadingScreen creation")
        }
        customLoadingScreen.prototype.displayLoadingUI = function () {
            console.log("customLoadingScreen loading")
            loadingScreenDiv.innerHTML = "loading";
        };
        customLoadingScreen.prototype.hideLoadingUI = function () {
            console.log("customLoadingScreen loaded")
            loadingScreenDiv.style.display = "none";
        };
        var loadingScreen = new customLoadingScreen();
        engine.loadingScreen = loadingScreen;

        engine.displayLoadingUI();

        var delayCreateScene = function () {
            var scene = new BABYLON.Scene(engine);
            scene.createDefaultCamera(true, true, true);
            BABYLON.SceneLoader.ImportMesh(
                "",
                "https://dl.dropbox.com/s/o5w0nlstfj21202/",
                "bDraco.glb",
                scene,
                function () {
                    scene.createDefaultCamera(true, true, true);
                    scene.createDefaultEnvironment();
                    scene.activeCamera.alpha = Math.PI / 2;

                    engine.hideLoadingUI();

                },
                function (evt) {
        // onProgress
        var loadedPercent = 0;
        if (evt.lengthComputable) {
            loadedPercent = (evt.loaded * 100 / evt.total).toFixed();
        } else {
            var dlCount = evt.loaded / (1024 * 1024);
            loadedPercent = Math.floor(dlCount * 100.0) / 100.0;
        }
        // assuming "loadingScreenPercent" is an existing html element
        document.getElementById("loadingScreen").innerHTML = loadedPercent;
    }
                
                
                
                );
            return scene;
        };
        var scene = delayCreateScene();

        engine.runRenderLoop(function () {
            if (scene) {
                scene.render();
            }
        });
        window.addEventListener("resize", function () {
            engine.resize();
        });
        viewer.updateConfiguration({
    camera: {
        panningSensibility: 0
    }
});
    </script>
</body>
</html>
