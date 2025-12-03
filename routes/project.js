'use strict'

var express = require('express');
var ProjectController = require('../controllers/project');

var router = express.Router();
var path = require('path');

// Configuración de Multer
var multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        cb(null, "project-" + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.get('/home', ProjectController.home);
router.post('/test', ProjectController.test);
router.post('/save-project', ProjectController.saveProject);
router.get('/project{/:id}', ProjectController.getProject);
router.get('/projects', ProjectController.getProjects);
router.put('/project{/:id}', ProjectController.updateProject);
router.delete('/project{/:id}', ProjectController.deleteProject);
// La palabra 'image' es el nombre del campo (name="image") en el formulario del frontend
router.post('/upload-image/:id', upload.single('image'), ProjectController.uploadImage);

module.exports = router;