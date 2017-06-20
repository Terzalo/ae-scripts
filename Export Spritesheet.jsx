{
  // Export Spritesheet.jsx
  // version 2017.06.20.1
  // by Dmitry Seregin
  //
  // This script exports frames from the current composition into a PNG spritesheet.
  //
  // Copyright (c) 2017 Dmitry Seregin
  // 
  // Permission is hereby granted, free of charge, to any person obtaining a copy
  // of this software and associated documentation files (the "Software"), to deal
  // in the Software without restriction, including without limitation the rights
  // to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  // copies of the Software, and to permit persons to whom the Software is
  // furnished to do so, subject to the following conditions:
  // 
  // The above copyright notice and this permission notice shall be included in all
  // copies or substantial portions of the Software.
  // 
  // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  // IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  // FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  // AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  // LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  // OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  // SOFTWARE.

  (function(){
    var currentProject  = (app.project) ? app.project: app.newProject();
    var sourceComp = currentProject.activeItem;
    if (!sourceComp) {
      alert("Please open the source composition.");
      return;
    }

    app.beginUndoGroup("Generate sprite sheet");

    var w = parseInt(prompt("Enter the number of columns for the spritesheet.", ""));
    var h = parseInt(prompt("Enter the number of rows for the spritesheet.", ""));

    if (!w || w < 0 || !h || h < 0) {
      alert("Invalid input.");
      return;
    }

    var sheetComp = currentProject.items.addComp("___SpriteSheet", sourceComp.width * w, sourceComp.height * h, 1, 1, 1);

    sheetComp.openInViewer();

    for (var y = 0; y < h; y++) {
      var yPos = (y+0.5) * sourceComp.height;
      for (var x = 0; x < w; x++) {
        var t = ( y * w + x ) * sourceComp.frameDuration;

        if (t >= sourceComp.duration) break;

        var xPos = (x+0.5) * sourceComp.width;

        var layer = sheetComp.layers.add(sourceComp);

        layer.transform.position.setValue([xPos, yPos]);

        layer.timeRemapEnabled = true;

        while ( layer.timeRemap.numKeys > 1 ) {
          layer.timeRemap.removeKey(1);
        }

        layer.timeRemap.setValueAtKey(1, t);
      }
    }

    var fileName = prompt("Enter output filename (will be saved on the desktop).", "");

    fileName = Folder.desktop.fsName + "\\/" + fileName + ".png";

    sheetComp.saveFrameToPng(0, new File(fileName));

    sheetComp.remove();
    app.endUndoGroup();
  })();
}