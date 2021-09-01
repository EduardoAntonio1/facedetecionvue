<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <h2 id="resultado">{{ resultado }}</h2>
      <video id="video" width="720" height="560" autoplay muted></video>
      <canvas id="canvas" width="720" height="560"></canvas>
    </v-col>
  </v-row>
</template>

<script>
export default {
  head() {
    return {
        script: [
          {   
              src: '/face-api.min.js',
              hid: 'stripe',
              defer: true,
              callback: () => { this.setDetections() }
          }
        ],
    }
  },
  data(){
    return {
      resultado: 'CARGANDO',
    }
  },
  methods: {
    setDetections() {

      const video = document.getElementById('video')

      Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
        faceapi.nets.faceExpressionNet.loadFromUri('/models'),
        faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
      ]).then(startVideo)

      function startVideo() {
        navigator.getUserMedia({ video: {} },
          stream => video.srcObject = stream,
          err => console.error(err)
        )
      }

      video.addEventListener('play', async() => {
        const labeledFaceDescriptors = await loadLabeledImages()
        const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6)
        const canvas = document.getElementById('canvas')
        const displaySize = { width: video.width, height: video.height }
        faceapi.matchDimensions(canvas, displaySize)
        setInterval(async() => {
          const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions().withFaceDescriptors()
          const resizedDetections = faceapi.resizeResults(detections, displaySize)
          const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor))
          canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
          faceapi.draw.drawDetections(canvas, resizedDetections)
          faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
          faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
          results.forEach((result, i) => {
            if (result._label == 'unknown') {
                this.resultado = 'DESCONOCIDO'
            } else if (result._label) {
                this.resultado = result._label
            }
            const box = resizedDetections[i].detection.box
            const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() })
            drawBox.draw(canvas)
          })
        }, 100)
      })

      function loadLabeledImages() {
        const labels = ['Aitana', 'Eduardo Antonio', 'Gaytan', 'Iris Selene', 'Jesus Eduardo', 'Luz Hernandez']
        return Promise.all(
          labels.map(async label => {
            const descriptions = []
            for (let i = 1; i <= 2; i++) {
              const img = await faceapi.fetchImage(`https://raw.githubusercontent.com/EduardoAntonio1/facedetections/main/labeled_images/${label}/${i}.jpg`)
              const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
              descriptions.push(detections.descriptor)
            }

            return new faceapi.LabeledFaceDescriptors(label, descriptions)
          })
        )
      }
    }
  }
}
</script>

<style scoped>
video {
  position: relative;
}
canvas {
  position: absolute;
  top: 32px;
  left: 426px;
}
</style>