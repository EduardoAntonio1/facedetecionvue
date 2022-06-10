<template>
    <v-row justify="center" align="center" style="height: 100%;">
        <v-dialog
        v-model="dialogEstasSeguro"
        width="500"
        >
            <v-card>
                <v-card-title>
                    ¿Estás seguro?
                </v-card-title>

                <v-card-text>
                    ¿Quieres subir la imagen con la etiqueta: <strong>{{nombre}}</strong>?
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                    <v-btn
                        color="error"
                        @click="dialogEstasSeguro = false"
                    >
                        Cancelar
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="success"
                        @click="onUpload"
                    >
                        Aceptar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog
        v-model="dialogSuccess"
        width="500"
        >
            <v-card>
                <v-card-title>
                    Imagen subida con éxito
                </v-card-title>

                <v-card-text>
                    Se ha subido la imagen con la etiqueta: <strong>{{nombre}}</strong> <br/> <br/>
                    Si ya se ha registrado una imagen con esta etiqueta anteriormente, se ha agregado esta nueva imagen a el registro existente.
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="success"
                        @click="dialogSuccess = false"
                    >
                        Aceptar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog
        v-model="dialogError"
        width="500"
        >
            <v-card>
                <v-card-title>
                    Ha ocurrido un error
                </v-card-title>

                <v-card-text>
                    La imagen no se ha podido registrar, inténtelo de nuevo más tarde
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="success"
                        @click="dialogError = false"
                    >
                        Aceptar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-col align="center" cols="12">
            <v-row class="ma-0 mb-5">
                <spinnerImgUpload v-if="isLoading" />
            </v-row>
            <v-row class="ma-0 mb-5" justify="center">
                <input ref="fileInput" style="display: none;" type="file" @change="onFileSelected" accept="image/*">
                <v-btn @click="$refs.fileInput.click()">Seleccionar imagen</v-btn>
            </v-row>
            <v-row class="ma-0 mb-5" justify="center" align="center">
                <img v-if="imageUrl" :src="imageUrl" height="500">
                <h2 v-else>Selecciona una imagen</h2>
            </v-row>
            <v-row v-if="imageUrl" class="ma-0 mb-1" justify="center">
               <v-text-field
                    style="max-width: 500px;"
                    v-model="nombre"
                    solo
                    label="Nombre de la persona"
                ></v-text-field>
            </v-row>
            <v-row v-if="imageUrl" class="ma-0" justify="center">
                <v-btn :disabled="nombre.length<3" @click="dialogEstasSeguro = true">Subir imagen</v-btn>
            </v-row>
        </v-col>
    </v-row>
</template>

<script>
import axios from 'axios'
import spinnerImgUpload from '../components/spinnerImgUpload.vue'
export default {
    components: {
        spinnerImgUpload,
    },
    data() {
        return {
            selectedFile: null,
            nombre: '',
            isLoading: false,
            imageUrl: null,
            dialogEstasSeguro: false,
            dialogSuccess: false,
            dialogError: false,
        }
    },
    methods: {
        onFileSelected(event) {
            if (event.target.files[0]) {
                var idxDot = event.target.files[0].name.lastIndexOf(".") + 1;
                var extFile = event.target.files[0].name.substr(idxDot, event.target.files[0].name.length).toLowerCase();
                if (extFile=="jpg" || extFile=="jpeg" || extFile=="png"){
                    this.selectedFile = event.target.files[0];
                    const fileReader = new FileReader();
                    fileReader.addEventListener('load', () => {
                        this.imageUrl = fileReader.result;
                    })
                    fileReader.readAsDataURL(event.target.files[0]);
                }else{
                    alert("Solo se aceptan imágenes en JPG, JPEG y PNG");
                    this.selectedFile = null;
                    this.imageUrl = null;
                }
            }
        },
        onUpload() {
            this.dialogEstasSeguro = false;
            if (this.selectedFile != null){
                this.isLoading = true;
                let fd = new FormData();
                fd.append('name', this.nombre);
                fd.append('files', this.selectedFile, this.selectedFile.name);
                axios.post('http://localhost:3000/api/person', fd)
                    .then(res => {
                        console.log(res);
                        this.isLoading = false;
                        this.dialogSuccess = true;
                        this.imageUrl = null;
                    })
                    .catch((response) => {
                        console.log("ERROR", response);
                        this.dialogError = true;
                        this.isLoading = false;
                    }); 
            }else {
                alert("No haz seleccionado una imagen válida, inténtalo de nuevo.");
            }
        }
    }
}
</script>

<style scoped>

</style>