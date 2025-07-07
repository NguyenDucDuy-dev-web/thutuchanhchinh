<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PDF Form Designer - Drag & Drop</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #f5f5f5;
            height: 100vh;
            overflow: hidden;
        }

        .container {
            display: flex;
            height: 100vh;
        }

        /* Sidebar */
        .sidebar {
            width: 280px;
            background: white;
            box-shadow: 2px 0 10px rgba(0,0,0,0.1);
            padding: 20px;
            overflow-y: auto;
            z-index: 10;
        }

        .sidebar h3 {
            color: #333;
            margin-bottom: 20px;
            font-size: 18px;
            border-bottom: 2px solid #4f46e5;
            padding-bottom: 10px;
        }

        .field-item {
            display: flex;
            align-items: center;
            padding: 12px;
            background: #f8fafc;
            border: 2px dashed #cbd5e1;
            border-radius: 8px;
            margin-bottom: 10px;
            cursor: grab;
            transition: all 0.3s ease;
            user-select: none;
        }

        .field-item:hover {
            background: #e2e8f0;
            border-color: #4f46e5;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(79, 70, 229, 0.15);
        }

        .field-item:active {
            cursor: grabbing;
        }

        .field-icon {
            font-size: 24px;
            margin-right: 12px;
        }

        .field-info h4 {
            color: #1e293b;
            font-size: 14px;
            font-weight: 600;
        }

        .field-info p {
            color: #64748b;
            font-size: 12px;
            margin-top: 2px;
        }

        .save-btn {
            width: 100%;
            background: #4f46e5;
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            margin-top: 20px;
            transition: background 0.3s ease;
        }

        .save-btn:hover {
            background: #4338ca;
        }

        /* Main Content */
        .main-content {
            flex: 1;
            display: flex;
            flex-direction: column;
        }

        /* Toolbar */
        .toolbar {
            background: white;
            padding: 15px 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .toolbar-left {
            display: flex;
            align-items: center;
            gap: 15px;
        }

        .upload-btn {
            background: #e5e7eb;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            font-size: 14px;
            cursor: pointer;
            transition: background 0.3s ease;
        }

        .upload-btn:hover {
            background: #d1d5db;
        }

        .toolbar-info {
            color: #6b7280;
            font-size: 14px;
        }

        /* Canvas Area */
        .canvas-area {
            flex: 1;
            padding: 20px;
            overflow: auto;
            background: #f9fafb;
        }

        .canvas {
            position: relative;
            width: 800px;
            height: 1000px;
            background: white;
            margin: 0 auto;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            border-radius: 8px;
            overflow: hidden;
        }

        .pdf-background {
            width: 100%;
            height: 100%;
            object-fit: contain;
            pointer-events: none;
            user-select: none;
        }

        /* Dropped Fields */
        .dropped-field {
            position: absolute;
            border: 2px solid #9ca3af;
            background: rgba(255, 255, 255, 0.9);
            border-radius: 4px;
            cursor: move;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: 600;
            color: #374151;
            transition: all 0.2s ease;
            user-select: none;
        }

        .dropped-field:hover {
            border-color: #4f46e5;
            box-shadow: 0 4px 12px rgba(79, 70, 229, 0.15);
        }

        .dropped-field.selected {
            border-color: #3b82f6;
            background: rgba(59, 130, 246, 0.1);
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
        }

        .field-delete {
            position: absolute;
            top: -8px;
            right: -8px;
            width: 20px;
            height: 20px;
            background: #ef4444;
            color: white;
            border: none;
            border-radius: 50%;
            font-size: 12px;
            cursor: pointer;
            display: none;
            align-items: center;
            justify-content: center;
        }

        .dropped-field.selected .field-delete {
            display: flex;
        }

        .field-delete:hover {
            background: #dc2626;
        }

        /* Drop Zone */
        .drop-zone-active {
            border: 4px dashed #4f46e5 !important;
            background: rgba(79, 70, 229, 0.05) !important;
        }

        .drop-indicator {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #4f46e5;
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            pointer-events: none;
            z-index: 1000;
        }

        /* Properties Panel */
        .properties {
            width: 280px;
            background: white;
            box-shadow: -2px 0 10px rgba(0,0,0,0.1);
            padding: 20px;
            overflow-y: auto;
        }

        .properties h3 {
            color: #333;
            margin-bottom: 20px;
            font-size: 18px;
            border-bottom: 2px solid #4f46e5;
            padding-bottom: 10px;
        }

        .prop-group {
            margin-bottom: 15px;
        }

        .prop-label {
            display: block;
            color: #374151;
            font-size: 13px;
            font-weight: 600;
            margin-bottom: 5px;
        }

        .prop-input {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            font-size: 14px;
            transition: border-color 0.3s ease;
        }

        .prop-input:focus {
            outline: none;
            border-color: #4f46e5;
            box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
        }

        .prop-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
        }

        .delete-field-btn {
            width: 100%;
            background: #ef4444;
            color: white;
            border: none;
            padding: 10px;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            margin-top: 20px;
            transition: background 0.3s ease;
        }

        .delete-field-btn:hover {
            background: #dc2626;
        }

        /* Status Messages */
        .status-message {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #10b981;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-weight: 600;
            z-index: 1000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
        }

        .status-message.show {
            transform: translateX(0);
        }

        /* Responsive */
        @media (max-width: 1200px) {
            .sidebar, .properties {
                width: 250px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Sidebar -->
        <div class="sidebar">
            <h3>🎯 Các trường dữ liệu</h3>
            
            <div class="field-list">
                <div class="field-item" draggable="true" data-type="full_name">
                    <span class="field-icon">👤</span>
                    <div class="field-info">
                        <h4>Họ và tên</h4>
                        <p>full_name</p>
                    </div>
                </div>

                <div class="field-item" draggable="true" data-type="dob">
                    <span class="field-icon">📅</span>
                    <div class="field-info">
                        <h4>Ngày sinh</h4>
                        <p>dob</p>
                    </div>
                </div>

                <div class="field-item" draggable="true" data-type="id_number">
                    <span class="field-icon">🆔</span>
                    <div class="field-info">
                        <h4>CMND/CCCD</h4>
                        <p>id_number</p>
                    </div>
                </div>

                <div class="field-item" draggable="true" data-type="phone">
                    <span class="field-icon">📞</span>
                    <div class="field-info">
                        <h4>Số điện thoại</h4>
                        <p>phone</p>
                    </div>
                </div>

                <div class="field-item" draggable="true" data-type="address">
                    <span class="field-icon">🏠</span>
                    <div class="field-info">
                        <h4>Địa chỉ</h4>
                        <p>address</p>
                    </div>
                </div>

                <div class="field-item" draggable="true" data-type="email">
                    <span class="field-icon">📧</span>
                    <div class="field-info">
                        <h4>Email</h4>
                        <p>email</p>
                    </div>
                </div>

                <div class="field-item" draggable="true" data-type="signature">
                    <span class="field-icon">✍️</span>
                    <div class="field-info">
                        <h4>Chữ ký</h4>
                        <p>signature</p>
                    </div>
                </div>

                <div class="field-item" draggable="true" data-type="date">
                    <span class="field-icon">📆</span>
                    <div class="field-info">
                        <h4>Ngày hiện tại</h4>
                        <p>date</p>
                    </div>
                </div>
            </div>

            <button class="save-btn" onclick="saveConfiguration()">
                💾 Lưu cấu hình
            </button>
        </div>

        <!-- Main Content -->
        <div class="main-content">
            <!-- Toolbar -->
            <div class="toolbar">
                <div class="toolbar-left">
                    <button class="upload-btn">📁 Tải PDF mới</button>
                    <span style="color: #d1d5db;">|</span>
                    <span class="toolbar-info">Kéo thả các trường từ sidebar vào vị trí mong muốn trên mẫu</span>
                </div>
                <div>
                    <button class="upload-btn">👁️ Xem trước</button>
                    <button class="upload-btn">⚙️ Cài đặt</button>
                </div>
            </div>

            <!-- Canvas Area -->
            <div class="canvas-area">
                <div class="canvas" id="canvas">
                    <!-- Background PDF Image -->
                    <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='1000'%3E%3Crect width='800' height='1000' fill='%23ffffff'/%3E%3Ctext x='50%25' y='15%25' text-anchor='middle' font-family='Arial' font-size='24' font-weight='bold' fill='%23333'%3EĐƠN XIN TẠM HOÃN NGHĨA VỤ QUÂN SỰ%3C/text%3E%3Ctext x='5%25' y='25%25' font-family='Arial' font-size='14' fill='%23666'%3EKính gửi: Đồng chí Chủ tịch UBND ................................................%3C/text%3E%3Ctext x='5%25' y='30%25' font-family='Arial' font-size='14' fill='%23666'%3ETôi tên: ................................................ sinh ngày:..........................%3C/text%3E%3Ctext x='5%25' y='35%25' font-family='Arial' font-size='14' fill='%23666'%3ENghề nghiệp: ................................................%3C/text%3E%3Ctext x='5%25' y='40%25' font-family='Arial' font-size='14' fill='%23666'%3ECMND/CCCD số:............................... ngày cấp ........... nơi cấp....................%3C/text%3E%3Ctext x='5%25' y='45%25' font-family='Arial' font-size='14' fill='%23666'%3EHộ khẩu thường trú:.................................................%3C/text%3E%3Ctext x='5%25' y='50%25' font-family='Arial' font-size='14' fill='%23666'%3ENay tôi làm đơn này kính mong đồng chí Chủ tịch UBND .................................%3C/text%3E%3Ctext x='5%25' y='55%25' font-family='Arial' font-size='14' fill='%23666'%3Exem xét cho tôi được tạm hoãn miễn nghĩa vụ quân sự%3C/text%3E%3Ctext x='5%25' y='65%25' font-family='Arial' font-size='14' fill='%23666'%3ELý do: ........................... theo Điều 41 của Luật nghĩa vụ quân sự năm%3C/text%3E%3Ctext x='5%25' y='70%25' font-family='Arial' font-size='14' fill='%23666'%3E2015 (Kèm theo giấy tờ có liên quan).%3C/text%3E%3Ctext x='5%25' y='80%25' font-family='Arial' font-size='14' fill='%23666'%3ETôi cam đoan những gì trình bày ở trên là hoàn toàn đúng sự thật, nếu có gì sai trái tôi xin%3C/text%3E%3Ctext x='5%25' y='85%25' font-family='Arial' font-size='14' fill='%23666'%3Ehoàn toàn chịu trách nhiệm trước pháp luật.%3C/text%3E%3Ctext x='65%25' y='95%25' font-family='Arial' font-size='14' fill='%23666'%3E........., ngày ..... tháng ..... năm 2022%3C/text%3E%3Ctext x='72%25' y='98%25' font-family='Arial' font-size='14' font-weight='bold' fill='%23666'%3ENGƯỜI LÀM ĐƠN%3C/text%3E%3C/svg%3E" 
                         alt="PDF Template" 
                         class="pdf-background">
                    
                    <!-- Dropped fields will be added here dynamically -->
                </div>
            </div>
        </div>

        <!-- Properties Panel -->
        <div class="properties" id="properties" style="display: none;">
            <h3>⚙️ Thuộc tính</h3>
            <div id="property-content">
                <!-- Properties will be populated dynamically -->
            </div>
        </div>
    </div>

    <!-- Status Message -->
    <div class="status-message" id="statusMessage">
        Đã lưu cấu hình thành công!
    </div>

    <script>
        let draggedType = null;
        let fields = [];
        let selectedField = null;
        let fieldCounter = 0;

        // Field type definitions
        const fieldTypes = {
            'full_name': { label: 'Họ và tên', icon: '👤' },
            'dob': { label: 'Ngày sinh', icon: '📅' },
            'id_number': { label: 'CMND/CCCD', icon: '🆔' },
            'phone': { label: 'Số điện thoại', icon: '📞' },
            'address': { label: 'Địa chỉ', icon: '🏠' },
            'email': { label: 'Email', icon: '📧' },
            'signature': { label: 'Chữ ký', icon: '✍️' },
            'date': { label: 'Ngày hiện tại', icon: '📆' }
        };

        // Initialize drag and drop
        document.addEventListener('DOMContentLoaded', function() {
            initializeDragAndDrop();
        });

        function initializeDragAndDrop() {
            const fieldItems = document.querySelectorAll('.field-item');
            const canvas = document.getElementById('canvas');

            // Setup drag start for field items
            fieldItems.forEach(item => {
                item.addEventListener('dragstart', (e) => {
                    draggedType = e.target.dataset.type;
                    e.dataTransfer.effectAllowed = 'copy';
                });
            });

            // Setup canvas drop events
            canvas.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'copy';
                canvas.classList.add('drop-zone-active');
                
                // Show drop indicator
                if (!document.querySelector('.drop-indicator')) {
                    const indicator = document.createElement('div');
                    indicator.className = 'drop-indicator';
                    indicator.textContent = `Thả vào đây để tạo trường "${fieldTypes[draggedType]?.label}"`;
                    canvas.appendChild(indicator);
                }
            });

            canvas.addEventListener('dragleave', (e) => {
                if (!canvas.contains(e.relatedTarget)) {
                    canvas.classList.remove('drop-zone-active');
                    const indicator = document.querySelector('.drop-indicator');
                    if (indicator) indicator.remove();
                }
            });

            canvas.addEventListener('drop', (e) => {
                e.preventDefault();
                canvas.classList.remove('drop-zone-active');
                
                // Remove drop indicator
                const indicator = document.querySelector('.drop-indicator');
                if (indicator) indicator.remove();

                if (!draggedType) return;

                const rect = canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                createField(draggedType, x - 75, y - 15); // Center the field
                draggedType = null;
            });

            // Click outside to deselect
            canvas.addEventListener('click', (e) => {
                if (e.target === canvas || e.target.classList.contains('pdf-background')) {
                    selectField(null);
                }
            });
        }

        function createField(type, x, y) {
            fieldCounter++;
            const field = {
                id: `field_${fieldCounter}`,
                type: type,
                label: fieldTypes[type].label,
                x: Math.max(0, x),
                y: Math.max(0, y),
                width: 150,
                height: 30
            };

            fields.push(field);
            renderField(field);
        }

        function renderField(field) {
            const canvas = document.getElementById('canvas');
            const fieldEl = document.createElement('div');
            fieldEl.className = 'dropped-field';
            fieldEl.id = field.id;
            fieldEl.style.left = field.x + 'px';
            fieldEl.style.top = field.y + 'px';
            fieldEl.style.width = field.width + 'px';
            fieldEl.style.height = field.height + 'px';
            fieldEl.textContent = field.label;

            // Delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'field-delete';
            deleteBtn.innerHTML = '✕';
            deleteBtn.onclick = (e) => {
                e.stopPropagation();
                removeField(field.id);
            };
            fieldEl.appendChild(deleteBtn);

            // Click to select
            fieldEl.addEventListener('click', (e) => {
                e.stopPropagation();
                selectField(field.id);
            });

            // Make draggable
            makeFieldDraggable(fieldEl, field);

            canvas.appendChild(fieldEl);
        }

        function makeFieldDraggable(element, field) {
            let isDragging = false;
            let startX, startY, initialX, initialY;

            element.addEventListener('mousedown', (e) => {
                if (e.target.classList.contains('field-delete')) return;
                
                isDragging = true;
                startX = e.clientX;
                startY = e.clientY;
                initialX = field.x;
                initialY = field.y;
                
                selectField(field.id);
                
                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
                
                e.preventDefault();
            });

            function onMouseMove(e) {
                if (!isDragging) return;

                const deltaX = e.clientX - startX;
                const deltaY = e.clientY - startY;
                
                field.x = Math.max(0, Math.min(800 - field.width, initialX + deltaX));
                field.y = Math.max(0, Math.min(1000 - field.height, initialY + deltaY));
                
                element.style.left = field.x + 'px';
                element.style.top = field.y + 'px';
                
                updateProperties();
            }

            function onMouseUp() {
                isDragging = false;
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            }
        }

        function selectField(fieldId) {
            // Remove previous selection
            document.querySelectorAll('.dropped-field').forEach(el => {
                el.classList.remove('selected');
            });

            selectedField = fieldId;
            
            if (fieldId) {
                const fieldEl = document.getElementById(fieldId);
                if (fieldEl) {
                    fieldEl.classList.add('selected');
                }
                showProperties();
            } else {
                hideProperties();
            }
        }

        function showProperties() {
            const panel = document.getElementById('properties');
            const content = document.getElementById('property-content');
            const field = fields.find(f => f.id === selectedField);
            
            if (!field) return;

            content.innerHTML = `
                <div class="prop-group">
                    <label class="prop-label">Nhãn</label>
                    <input type="text" class="prop-input" value="${field.label}" 
                           onchange="updateFieldProperty('label', this.value)">
                </div>
                
                <div class="prop-group">
                    <div class="prop-row">
                        <div>
                            <label class="prop-label">X</label>
                            <input type="number" class="prop-input" value="${field.x}" 
                                   onchange="updateFieldProperty('x', parseInt(this.value))">
                        </div>
                        <div>
                            <label class="prop-label">Y</label>
                            <input type="number" class="prop-input" value="${field.y}" 
                                   onchange="updateFieldProperty('y', parseInt(this.value))">
                        </div>
                    </div>
                </div>
                
                <div class="prop-group">
                    <div class="prop-row">
                        <div>
                            <label class="prop-label">Rộng</label>
                            <input type="number" class="prop-input" value="${field.width}" 
                                   onchange="updateFieldProperty('width', parseInt(this.value))">
                        </div>
                        <div>
                            <label class="prop-label">Cao</label>
                            <input type="number" class="prop-input" value="${field.height}" 
                                   onchange="updateFieldProperty('height', parseInt(this.value))">
                        </div>
                    </div>
                </div>
                
                <button class="delete-field-btn" onclick="removeField('${field.id}')">
                    🗑️ Xóa trường
                </button>
            `;
            
            panel.style.display = 'block';
        }

        function hideProperties() {
            document.getElementById('properties').style.display = 'none';
        }

        function updateProperties() {
            if (selectedField) {
                showProperties();
            }
        }

        function updateFieldProperty(property, value) {
            const field = fields.find(f => f.id === selectedField);
            if (!field) return;

            field[property] = value;
            
            const fieldEl = document.getElementById(selectedField);
            if (fieldEl) {
                switch(property) {
                    case 'label':
                        fieldEl.textContent = value;
                        // Re-add delete button
                        const deleteBtn = document.createElement('button');
                        deleteBtn.className = 'field-delete';
                        deleteBtn.innerHTML = '✕';
                        deleteBtn.onclick = (e) => {
                            e.stopPropagation();
                            removeField(field.id);
                        };
                        fieldEl.appendChild(deleteBtn);
                        break;
                    case 'x':
                        fieldEl.style.left = value + 'px';
                        break;
                    case 'y':
                        fieldEl.style.top = value + 'px';
                        break;
                    case 'width':
                        fieldEl.style.width = value + 'px';
                        break;
                    case 'height':
                        fieldEl.style.height = value + 'px';
                        break;
                }
            }
        }

        function removeField(fieldId) {
            fields = fields.filter(f => f.id !== fieldId);
            const fieldEl = document.getElementById(fieldId);
            if (fieldEl) {
                fieldEl.remove();
            }
            
            if (selectedField === fieldId) {
                selectField(null);
            }
        }

        function saveConfiguration() {
            const config = {
                template_name: "Đơn xin tạm hoãn nghĩa vụ quân sự",
                fields: fields.map(f => ({
                    field_name: f.type,
                    label: f.label,
                    x: f.x,
                    y: f.y,
                    width: f.width,
                    height: f.height
                }))
            };
            
            console.log('Configuration saved:', config);
            
            // Show success message
            const statusMsg = document.getElementById('statusMessage');
            statusMsg.classList.add('show');
            setTimeout(() => {
                statusMsg.classList.remove('show');
            }, 3000);
            
            // Here you would typically send the config to your Laravel backend
            // fetch('/api/save-template-config', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(config)
            // });
        }
    </script>
</body>
</html>