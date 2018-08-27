var app = new Vue({
    el: '#app',
    data: {
      scanner: null,
      activeCameraId: null,
      cameras: [],
      scans: []
    },
    mounted: function () {
      var self = this;
      self.scanner = new Instascan.Scanner({ video: document.getElementById('preview'), scanPeriod: 3 });
      self.scanner.addListener('scan', function (content, image) {
        self.scans.unshift({ date: +(Date.now()), content: 'Transfiriendo saldo...' });        
        //console.log("Contenido: ", content);
        ObtenerQR(content);
        //console.log("Image: ", image);
      });
      Instascan.Camera.getCameras().then(function (cameras) {
        self.cameras = cameras;
        if (cameras.length > 0) {
          self.activeCameraId = cameras[0].id;
          self.scanner.start(cameras[0]);
        } else {
          console.error('No existen camaras.');
        }
      }).catch(function (e) {
        console.error(e);
      });
    },
    methods: {
      formatName: function (name) {
        return name || '(unknown)';
      },
      selectCamera: function (camera) {
        this.activeCameraId = camera.id;
        this.scanner.start(camera);
      }
    }
  });
  


function IrAPrincipal(){
  history.back();
}