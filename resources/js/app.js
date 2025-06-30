// Plastic Surgery Diagnosis Application
class PlasticSurgeryApp {
    constructor() {
        this.currentPatient = null;
        this.activeTab = 'overview';
        this.sidebarCollapsed = false;
        this.imageAnnotations = [];
        this.measurements = [];
        this.viewer3D = null;
        
        this.initializeApp();
    }

    initializeApp() {
        this.initializeSidebar();
        this.initializeTabs();
        this.initializeImageViewer();
        this.initialize3DViewer();
        this.initializeModals();
        this.initializeForms();
        this.loadSampleData();
    }

    // Sidebar Management
    initializeSidebar() {
        const toggleBtn = document.getElementById('sidebar-toggle');
        const sidebar = document.getElementById('sidebar');
        
        if (toggleBtn && sidebar) {
            toggleBtn.addEventListener('click', () => {
                this.sidebarCollapsed = !this.sidebarCollapsed;
                sidebar.classList.toggle('collapsed', this.sidebarCollapsed);
                
                if (this.sidebarCollapsed) {
                    sidebar.style.width = '80px';
                } else {
                    sidebar.style.width = '280px';
                }
            });
        }

        // Sidebar navigation
        document.querySelectorAll('.sidebar-nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = item.dataset.section;
                this.navigateToSection(section);
            });
        });
    }

    navigateToSection(section) {
        // Update active sidebar item
        document.querySelectorAll('.sidebar-nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-section="${section}"]`).classList.add('active');

        // Show corresponding content
        this.showSection(section);
    }

    showSection(section) {
        document.querySelectorAll('.main-section').forEach(sec => {
            sec.classList.add('hidden');
        });
        
        const targetSection = document.getElementById(`section-${section}`);
        if (targetSection) {
            targetSection.classList.remove('hidden');
            targetSection.classList.add('fade-in-up');
        }
    }

    // Tab Management
    initializeTabs() {
        document.querySelectorAll('[data-tab]').forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                const tabId = tab.dataset.tab;
                this.switchTab(tabId);
            });
        });
    }

    switchTab(tabId) {
        this.activeTab = tabId;
        
        // Update tab buttons
        document.querySelectorAll('[data-tab]').forEach(tab => {
            tab.classList.remove('active', 'bg-blue-600', 'text-white');
            tab.classList.add('bg-gray-100', 'text-gray-600');
        });
        
        const activeTab = document.querySelector(`[data-tab="${tabId}"]`);
        if (activeTab) {
            activeTab.classList.add('active', 'bg-blue-600', 'text-white');
            activeTab.classList.remove('bg-gray-100', 'text-gray-600');
        }

        // Update tab content
        document.querySelectorAll('[data-tab-content]').forEach(content => {
            content.classList.add('hidden');
        });
        
        const activeContent = document.querySelector(`[data-tab-content="${tabId}"]`);
        if (activeContent) {
            activeContent.classList.remove('hidden');
            activeContent.classList.add('fade-in-up');
        }
    }

    // Image Viewer with Professional Tools
    initializeImageViewer() {
        this.setupImageAnnotations();
        this.setupMeasurementTools();
        this.setupImageComparison();
        this.setupImageFilters();
    }

    setupImageAnnotations() {
        document.querySelectorAll('.image-viewer').forEach(viewer => {
            viewer.addEventListener('click', (e) => {
                if (document.querySelector('.annotation-tool.active')) {
                    this.addAnnotation(e, viewer);
                }
            });
        });

        // Annotation tool toggle
        document.querySelectorAll('.annotation-tool').forEach(tool => {
            tool.addEventListener('click', () => {
                document.querySelectorAll('.annotation-tool').forEach(t => t.classList.remove('active'));
                tool.classList.add('active');
            });
        });
    }

    addAnnotation(event, viewer) {
        const rect = viewer.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;

        const annotation = {
            id: Date.now(),
            x: x,
            y: y,
            note: prompt('Enter annotation note:') || 'Annotation',
            timestamp: new Date().toISOString()
        };

        this.imageAnnotations.push(annotation);
        this.renderAnnotation(annotation, viewer);
    }

    renderAnnotation(annotation, viewer) {
        const point = document.createElement('div');
        point.className = 'annotation-point';
        point.style.left = `${annotation.x}%`;
        point.style.top = `${annotation.y}%`;
        point.title = annotation.note;
        point.dataset.annotationId = annotation.id;

        point.addEventListener('click', (e) => {
            e.stopPropagation();
            this.showAnnotationDetails(annotation);
        });

        viewer.appendChild(point);
    }

    setupMeasurementTools() {
        let measurementMode = false;
        let startPoint = null;

        document.querySelectorAll('.measurement-tool').forEach(tool => {
            tool.addEventListener('click', () => {
                measurementMode = !measurementMode;
                tool.classList.toggle('active', measurementMode);
                
                document.querySelectorAll('.image-viewer').forEach(viewer => {
                    viewer.classList.toggle('measurement-tool', measurementMode);
                });
            });
        });

        document.querySelectorAll('.image-viewer').forEach(viewer => {
            viewer.addEventListener('mousedown', (e) => {
                if (measurementMode && !startPoint) {
                    const rect = viewer.getBoundingClientRect();
                    startPoint = {
                        x: e.clientX - rect.left,
                        y: e.clientY - rect.top
                    };
                }
            });

            viewer.addEventListener('mouseup', (e) => {
                if (measurementMode && startPoint) {
                    const rect = viewer.getBoundingClientRect();
                    const endPoint = {
                        x: e.clientX - rect.left,
                        y: e.clientY - rect.top
                    };

                    this.createMeasurement(startPoint, endPoint, viewer);
                    startPoint = null;
                }
            });
        });
    }

    createMeasurement(start, end, viewer) {
        const distance = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
        const angle = Math.atan2(end.y - start.y, end.x - start.x) * 180 / Math.PI;
        
        const measurement = {
            id: Date.now(),
            start: start,
            end: end,
            distance: distance,
            angle: angle,
            realDistance: (distance * 0.1).toFixed(1) + 'mm' // Mock conversion
        };

        this.measurements.push(measurement);
        this.renderMeasurement(measurement, viewer);
    }

    renderMeasurement(measurement, viewer) {
        const line = document.createElement('div');
        line.className = 'measurement-line';
        line.style.left = `${measurement.start.x}px`;
        line.style.top = `${measurement.start.y}px`;
        line.style.width = `${measurement.distance}px`;
        line.style.transform = `rotate(${measurement.angle}deg)`;

        const label = document.createElement('div');
        label.className = 'measurement-label';
        label.textContent = measurement.realDistance;
        label.style.left = `${(measurement.start.x + measurement.end.x) / 2}px`;
        label.style.top = `${(measurement.start.y + measurement.end.y) / 2}px`;

        viewer.appendChild(line);
        viewer.appendChild(label);
    }

    setupImageComparison() {
        document.querySelectorAll('.comparison-slider').forEach(slider => {
            const handle = slider.querySelector('.comparison-handle');
            const beforeImage = slider.querySelector('.before-image');
            
            if (handle && beforeImage) {
                let isDragging = false;

                handle.addEventListener('mousedown', () => {
                    isDragging = true;
                });

                document.addEventListener('mousemove', (e) => {
                    if (!isDragging) return;

                    const rect = slider.getBoundingClientRect();
                    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
                    const percentage = (x / rect.width) * 100;

                    handle.style.left = `${percentage}%`;
                    beforeImage.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
                });

                document.addEventListener('mouseup', () => {
                    isDragging = false;
                });
            }
        });
    }

    setupImageFilters() {
        document.querySelectorAll('.filter-control').forEach(control => {
            control.addEventListener('input', (e) => {
                const filterType = control.dataset.filter;
                const value = control.value;
                const targetImage = document.querySelector('.filtered-image');
                
                if (targetImage) {
                    this.applyImageFilter(targetImage, filterType, value);
                }
            });
        });
    }

    applyImageFilter(image, filterType, value) {
        const filters = {
            brightness: `brightness(${value}%)`,
            contrast: `contrast(${value}%)`,
            saturation: `saturate(${value}%)`,
            blur: `blur(${value}px)`
        };

        const currentFilters = image.style.filter || '';
        const filterRegex = new RegExp(`${filterType}\\([^)]*\\)`, 'g');
        const newFilter = currentFilters.replace(filterRegex, '') + ' ' + filters[filterType];
        
        image.style.filter = newFilter.trim();
    }

    // 3D Viewer Implementation
    initialize3DViewer() {
        const container = document.getElementById('viewer-3d');
        if (!container || typeof THREE === 'undefined') return;

        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(1, 1, 1);
        scene.add(directionalLight);

        // Create 3D face model (simplified)
        this.create3DFaceModel(scene);

        // Camera position
        camera.position.z = 5;

        // Controls
        this.setup3DControls(camera, renderer, scene);

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        };
        animate();

        this.viewer3D = { scene, camera, renderer };
    }

    create3DFaceModel(scene) {
        // Head geometry
        const headGeometry = new THREE.SphereGeometry(1, 32, 32);
        const headMaterial = new THREE.MeshLambertMaterial({ color: 0xffdbac });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.scale.set(1, 1.2, 0.8);
        scene.add(head);

        // Nose
        const noseGeometry = new THREE.ConeGeometry(0.1, 0.3, 8);
        const noseMaterial = new THREE.MeshLambertMaterial({ color: 0xffdbac });
        const nose = new THREE.Mesh(noseGeometry, noseMaterial);
        nose.position.set(0, 0, 0.8);
        nose.rotation.x = Math.PI;
        scene.add(nose);

        // Eyes
        const eyeGeometry = new THREE.SphereGeometry(0.1, 16, 16);
        const eyeMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
        
        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.set(-0.3, 0.3, 0.7);
        scene.add(leftEye);

        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        rightEye.position.set(0.3, 0.3, 0.7);
        scene.add(rightEye);

        // Store references for manipulation
        this.faceModel = { head, nose, leftEye, rightEye };
    }

    setup3DControls(camera, renderer, scene) {
        let isRotating = false;
        let previousMousePosition = { x: 0, y: 0 };

        renderer.domElement.addEventListener('mousedown', (e) => {
            isRotating = true;
            previousMousePosition = { x: e.clientX, y: e.clientY };
        });

        document.addEventListener('mousemove', (e) => {
            if (!isRotating) return;

            const deltaMove = {
                x: e.clientX - previousMousePosition.x,
                y: e.clientY - previousMousePosition.y
            };

            scene.rotation.y += deltaMove.x * 0.01;
            scene.rotation.x += deltaMove.y * 0.01;

            previousMousePosition = { x: e.clientX, y: e.clientY };
        });

        document.addEventListener('mouseup', () => {
            isRotating = false;
        });

        // Zoom controls
        renderer.domElement.addEventListener('wheel', (e) => {
            camera.position.z += e.deltaY * 0.01;
            camera.position.z = Math.max(2, Math.min(10, camera.position.z));
        });

        // 3D manipulation controls
        this.setup3DManipulationControls();
    }

    setup3DManipulationControls() {
        document.querySelectorAll('.model-control').forEach(control => {
            control.addEventListener('input', (e) => {
                const controlType = control.dataset.control;
                const value = parseFloat(control.value);
                this.apply3DTransformation(controlType, value);
            });
        });
    }

    apply3DTransformation(controlType, value) {
        if (!this.faceModel) return;

        switch (controlType) {
            case 'nose-size':
                this.faceModel.nose.scale.setScalar(value);
                break;
            case 'nose-position':
                this.faceModel.nose.position.z = 0.8 + (value - 1) * 0.2;
                break;
            case 'eye-distance':
                this.faceModel.leftEye.position.x = -0.3 * value;
                this.faceModel.rightEye.position.x = 0.3 * value;
                break;
            case 'face-width':
                this.faceModel.head.scale.x = value;
                break;
            case 'face-height':
                this.faceModel.head.scale.y = value;
                break;
        }
    }

    // Modal Management
    initializeModals() {
        document.querySelectorAll('[data-modal-open]').forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                const modalId = trigger.dataset.modalOpen;
                this.openModal(modalId);
            });
        });

        document.querySelectorAll('[data-modal-close]').forEach(trigger => {
            trigger.addEventListener('click', () => {
                const modal = trigger.closest('.modal');
                if (modal) {
                    this.closeModal(modal.id);
                }
            });
        });

        // Close modal on backdrop click
        document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
            backdrop.addEventListener('click', (e) => {
                if (e.target === backdrop) {
                    const modal = backdrop.closest('.modal');
                    if (modal) {
                        this.closeModal(modal.id);
                    }
                }
            });
        });
    }

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
    }

    // Form Management
    initializeForms() {
        document.querySelectorAll('.dynamic-form').forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission(form);
            });
        });

        // Dynamic field addition
        document.querySelectorAll('[data-add-field]').forEach(button => {
            button.addEventListener('click', () => {
                const fieldType = button.dataset.addField;
                const container = button.parentElement.querySelector('.dynamic-fields');
                this.addDynamicField(fieldType, container);
            });
        });
    }

    addDynamicField(fieldType, container) {
        const fieldTemplates = {
            procedure: `
                <div class="dynamic-field flex items-center gap-2 mb-2 fade-in-up">
                    <input type="text" name="procedures[]" class="flex-1 border border-gray-300 rounded-md px-3 py-2" placeholder="Enter procedure...">
                    <button type="button" class="remove-field text-red-600 hover:text-red-700">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
            `,
            measurement: `
                <div class="dynamic-field grid grid-cols-3 gap-2 mb-2 fade-in-up">
                    <input type="text" name="measurement_names[]" class="border border-gray-300 rounded-md px-3 py-2" placeholder="Measurement">
                    <input type="number" name="measurement_values[]" class="border border-gray-300 rounded-md px-3 py-2" placeholder="Value">
                    <button type="button" class="remove-field text-red-600 hover:text-red-700">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
            `
        };

        if (fieldTemplates[fieldType]) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = fieldTemplates[fieldType];
            const field = tempDiv.firstElementChild;
            
            // Add remove functionality
            field.querySelector('.remove-field').addEventListener('click', () => {
                field.remove();
            });
            
            container.appendChild(field);
        }
    }

    handleFormSubmission(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Process form data
        console.log('Form submitted:', data);
        
        // Show success message
        this.showNotification('Data saved successfully!', 'success');
        
        // Close modal if form is in modal
        const modal = form.closest('.modal');
        if (modal) {
            this.closeModal(modal.id);
        }
    }

    // Utility Functions
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
            type === 'success' ? 'bg-green-500 text-white' : 
            type === 'error' ? 'bg-red-500 text-white' : 
            'bg-blue-500 text-white'
        }`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    loadSampleData() {
        this.currentPatient = {
            id: 1,
            name: 'Sarah Johnson',
            age: 28,
            consultationDate: '2024-01-15',
            procedures: ['Rhinoplasty Consultation', 'Facial Analysis'],
            status: 'consultation'
        };
        
        this.updatePatientDisplay();
    }

    updatePatientDisplay() {
        if (this.currentPatient) {
            document.getElementById('patient-name').textContent = this.currentPatient.name;
            document.getElementById('patient-age').textContent = this.currentPatient.age;
            document.getElementById('consultation-date').textContent = this.currentPatient.consultationDate;
        }
    }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.plasticSurgeryApp = new PlasticSurgeryApp();
});

// Global utility functions
window.openModal = function(modalId) {
    window.plasticSurgeryApp.openModal(modalId);
};

window.closeModal = function(modalId) {
    window.plasticSurgeryApp.closeModal(modalId);
};

window.switchTab = function(tabId) {
    window.plasticSurgeryApp.switchTab(tabId);
};