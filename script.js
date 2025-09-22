// Глобальные переменные
let currentZoom = 1;
let svgElement = null;
let showHeatmap = true;
let panX = 0, panY = 0;
let isDragging = false;
let startX, startY;
let isMobile = window.innerWidth <= 768;
let mobileControlsOpen = false;
let mapInfoOpen = false;

// Маппинг названий станций к их ID в SVG
const stationMapping = {
    'Сокольники': 's1_1_Sokolniki',
    'Красноселькая': 's1_Krasnoselskaya',
    'Комсомольская': 's1_1_Komsomolskaya',
    'Красные ворота': 's1_Krasniye_Vorota',
    'Чистые пруды': 's1_1_Chistye_Prudy',
    'Лубянка': 's1_2_Lubyanka',
    'Охотный ряд': 's1_1_Okhotny_Ryad',
    'Библиотека имени Ленина': 's1_4_Biblioteka_Im_Lenina',
    'Кропоткинская': 's1_1_Kropotkinskaya',
    'Парк культуры': 's1_2_Park_Kultury',
    'Фрунзенская': 's1_Frunzenskaya',
    'Спортивная': 's1_Sportivnaya',
    'Воробьёвы горы': 's1_Vorobyovy_Gory',
    'Университет': 's1_Universitet',
    'Проспект Вернадского': 's1_2_Prospekt_Vernadskogo',
    'Юго-Западная': 's1_Yugo_Zapadnaya',
    'Тропарёво': 's1_Troparyovo',
    'Румянцево': 's1_Rumyantsevo',
    'Саларьево': 's1_Salaryevo',
    'Речной вокзал': 's2_Rechnoy_Vokzal',
    'Водный стадион': 's2_1_Vodny_Stadion',
    'Войковская': 's2_4_Voykovskaya',
    'Сокол': 's2_Sokol',
    'Аэропорт': 's2_Aeroport',
    'Динамо': 's2_2_Dinamo',
    'Белорусская': 's2_3_Belorusskaya',
    'Маяковская': 's2_Mayakovskaya',
    'Тверская': 's2_7_Tverskaya',
    'Театральная': 's2_3_Teatralnaya',
    'Новокузнецкая': 's2_2_Novokuznetskaya',
    'Павелецкая': 's2_3_Paveletskaya',
    'Автозаводская': 's2_4_Avtozavodskaya',
    'Технопарк': 's2_Tekhnopark',
    'Коломенская': 's2_4_Kolomenskaya',
    'Каширская': 's2_3_Kashirskaya',
    'Кантемировская': 's2_4_Kantemirovskaya',
    'Царицыно': 's2_4_Tsaritsyno',
    'Орехово': 's2_4_Orekhovo',
    'Домодедовская': 's2_4_Domodedovskaya',
    'Красногвардейская': 's2_2_Krasnogvardeyskaya'
};

// Данные об инцидентах за последние 24 часа (симуляция)
const incidentData = {
    'Сокольники': 0,
    'Красные ворота': 3,
    'Чистые пруды': 1,
    'Лубянка': 0,
    'Охотный ряд': 2,
    'Тверская': 1,
    'Театральная': 0,
    'Новокузнецкая': 0,
    'Павелецкая': 1,
    'Автозаводская': 0,
    'Каширская': 2,
    'Красногвардейская': 1,
    'Кропоткинская': 0,
    'Парк культуры': 1,
    'Фрунзенская': 0,
    'Спортивная': 0,
    'Воробьёвы горы': 0,
    'Университет': 0,
    'Проспект Вернадского': 1,
    'Юго-Западная': 0
};

// Информация о станциях
const stationInfo = {
    'Сокольники': {
        name: 'Сокольники',
        line: 'Сокольническая',
        coords: '55.7887, 37.6797',
        escalators: 2,
        cameras: 2,
        lastIncident: '20.09.2025'
    },
    'Красные ворота': {
        name: 'Красные ворота',
        line: 'Сокольническая', 
        coords: '55.7687, 37.6346',
        escalators: 3,
        cameras: 1,
        lastIncident: 'Сегодня 14:35'
    },
    'Чистые пруды': {
        name: 'Чистые пруды',
        line: 'Сокольническая',
        coords: '55.7653, 37.6387',
        escalators: 2,
        cameras: 2,
        lastIncident: 'Сегодня 12:10'
    },
    'Лубянка': {
        name: 'Лубянка',
        line: 'Сокольническая',
        coords: '55.7587, 37.6281',
        escalators: 4,
        cameras: 3,
        lastIncident: '19.09.2025'
    },
    'Охотный ряд': {
        name: 'Охотный ряд',
        line: 'Сокольническая',
        coords: '55.7570, 37.6156',
        escalators: 3,
        cameras: 2,
        lastIncident: 'Сегодня 13:22'
    },
    'Тверская': {
        name: 'Тверская',
        line: 'Замоскворецкая',
        coords: '55.7664, 37.6043',
        escalators: 2,
        cameras: 2,
        lastIncident: 'Сегодня 11:45'
    }
};

// Theme toggle functionality
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    if (!themeToggle) return;
    
    // Check for saved theme preference or default to light
    const currentTheme = localStorage.getItem('theme') || 'light';
    body.setAttribute('data-theme', currentTheme);
    themeToggle.textContent = currentTheme === 'dark' ? '☀️' : '🌙';

    themeToggle.addEventListener('click', () => {
        const isCurrentlyDark = body.getAttribute('data-theme') === 'dark';
        const newTheme = isCurrentlyDark ? 'light' : 'dark';
        
        body.setAttribute('data-theme', newTheme);
        themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
        localStorage.setItem('theme', newTheme);
    });
}

// Mobile navigation functionality
function initMobileNavigation() {
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileNavClose = document.getElementById('mobile-nav-close');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    if (mobileMenuToggle && mobileNav) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileNav.classList.add('active');
        });
    }

    if (mobileNavClose && mobileNav) {
        mobileNavClose.addEventListener('click', () => {
            mobileNav.classList.remove('active');
        });
    }

    // Close mobile nav when clicking outside
    if (mobileNav) {
        mobileNav.addEventListener('click', (e) => {
            if (e.target === mobileNav) {
                mobileNav.classList.remove('active');
            }
        });
    }

    // Mobile navigation links
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all links
            document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link and corresponding desktop link
            link.classList.add('active');
            const targetPage = link.getAttribute('data-page');
            const desktopLink = document.querySelector(`.nav-link[data-page="${targetPage}"]`);
            if (desktopLink) {
                desktopLink.classList.add('active');
            }
            
            // Show corresponding page
            document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
            const targetPageElement = document.getElementById(targetPage);
            if (targetPageElement) {
                targetPageElement.classList.add('active');
            }
            
            // Close mobile nav
            if (mobileNav) {
                mobileNav.classList.remove('active');
            }
        });
    });
}

// Desktop navigation functionality
function initDesktopNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all links
            document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link and corresponding mobile link
            link.classList.add('active');
            const targetPage = link.getAttribute('data-page');
            const mobileLink = document.querySelector(`.mobile-nav-link[data-page="${targetPage}"]`);
            if (mobileLink) {
                mobileLink.classList.add('active');
            }
            
            // Show corresponding page
            document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
            const targetPageElement = document.getElementById(targetPage);
            if (targetPageElement) {
                targetPageElement.classList.add('active');
            }
        });
    });
}

// Mobile controls functionality
function toggleMobileControls() {
    mobileControlsOpen = !mobileControlsOpen;
    const panel = document.getElementById('mobile-controls-panel');
    if (panel) {
        if (mobileControlsOpen) {
            panel.classList.add('active');
        } else {
            panel.classList.remove('active');
        }
    }
}

// Mobile map info functionality
function toggleMobileMapInfo() {
    mapInfoOpen = !mapInfoOpen;
    const mapInfo = document.getElementById('map-info-mobile');
    if (mapInfo) {
        if (mapInfoOpen) {
            mapInfo.classList.add('active');
        } else {
            mapInfo.classList.remove('active');
        }
    }
}

function showMapLegend() {
    const legendContent = `Тепловая карта инцидентов за 24 часа:

🟢 Зелёный - 0 инцидентов
🟡 Жёлтый - 1-2 инцидента  
🔴 Красный - 3+ инцидентов
⚫ Серый - нет данных

Управление:
• Масштабирование: жесты pinch или кнопки +/-
• Перемещение: перетаскивание пальцем
• Информация: нажатие на станцию`;
    
    alert(legendContent);
    toggleMobileControls(); // Close controls after showing legend
}

// Add vibration feedback for mobile interactions (if supported)
function vibrateFeedback(pattern = [10]) {
    if (isMobile && 'vibrate' in navigator) {
        navigator.vibrate(pattern);
    }
}

// Загрузка SVG карты
async function loadMetroMap() {
    try {
        // Загружаем map.svg из папки с index.html
        const response = await fetch('map.svg');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const svgContent = await response.text();
        const container = document.getElementById('svg-container');
        if (container) {
            container.innerHTML = svgContent;
            
            svgElement = container.querySelector('svg');
            if (svgElement) {
                svgElement.style.width = '500%';
                svgElement.style.height = '500%';
                svgElement.style.cursor = isMobile ? 'default' : 'grab';
                svgElement.style.touchAction = 'none';
                
                // Настраиваем станции в загруженном SVG
                setupStationsFromSVG();
                setupSVGInteractivity();
                applyHeatmap();
            }
        }
    } catch (error) {
        console.error('Ошибка загрузки карты метро:', error);
        console.log('Переключаюсь на демо-карту...');
        
        // Fallback на демо-карту если map.svg не найден
        try {
            const svgContent = createDemoSVG();
            const container = document.getElementById('svg-container');
            if (container) {
                container.innerHTML = svgContent;
                
                svgElement = container.querySelector('svg');
                if (svgElement) {
                    svgElement.style.width = '100%';
                    svgElement.style.height = '100%';
                    svgElement.style.cursor = isMobile ? 'default' : 'grab';
                    svgElement.style.touchAction = 'none';
                    
                    setupSVGInteractivity();
                    applyHeatmap();
                }
            }
        } catch (fallbackError) {
            const container = document.getElementById('svg-container');
            if (container) {
                container.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: var(--text-secondary); text-align: center; padding: 2rem;">⚠️<br>Ошибка загрузки карты метро<br><small>Проверьте наличие файла map.svg</small></div>';
            }
        }
    }
}

// Настройка станций в загруженном SVG
function setupStationsFromSVG() {
    if (!svgElement) return;

    // Ищем все круглые объекты (станции) в SVG
    const circles = svgElement.querySelectorAll('circle');
    
    circles.forEach(circle => {
        // Определяем станции по размеру (обычно станции имеют радиус больше 8)
        const radius = parseFloat(circle.getAttribute('r') || '0');
        if (radius >= 8) {
            // Добавляем класс метро станции
            circle.classList.add('metro-station');
            
            // Получаем ID элемента для сопоставления с данными
            const elementId = circle.getAttribute('id');
            let stationName = null;
            
            // Ищем соответствие в маппинге
            for (const [name, id] of Object.entries(stationMapping)) {
                if (id === elementId) {
                    stationName = name;
                    break;
                }
            }
            
            // Если не нашли в маппинге, пытаемся извлечь из ID или соседних текстовых элементов
            if (!stationName) {
                // Ищем ближайший текстовый элемент
                const textElements = svgElement.querySelectorAll('text');
                let closestText = null;
                let minDistance = Infinity;
                
                const cx = parseFloat(circle.getAttribute('cx') || '0');
                const cy = parseFloat(circle.getAttribute('cy') || '0');
                
                textElements.forEach(textEl => {
                    const x = parseFloat(textEl.getAttribute('x') || '0');
                    const y = parseFloat(textEl.getAttribute('y') || '0');
                    const distance = Math.sqrt(Math.pow(cx - x, 2) + Math.pow(cy - y, 2));
                    
                    if (distance < minDistance && distance < 50) { // В пределах 50 единиц
                        minDistance = distance;
                        closestText = textEl.textContent.trim();
                    }
                });
                
                if (closestText) {
                    stationName = closestText;
                } else {
                    // Генерируем имя из ID
                    stationName = elementId ? elementId.replace(/[^a-zA-Zа-яА-Я]/g, ' ').trim() : 'Неизвестная станция';
                }
            }
            
            // Добавляем атрибут data-station
            circle.setAttribute('data-station', stationName);
            
            // Создаем и добавляем title элемент для tooltip
            let titleElement = circle.querySelector('title');
            if (!titleElement) {
                titleElement = document.createElementNS('http://www.w3.org/2000/svg', 'title');
                circle.appendChild(titleElement);
            }
            
            // Получаем информацию о станции
            const info = stationInfo[stationName];
            const incidents = incidentData[stationName] || 0;
            
            let titleText;
            if (info) {
                titleText = `${info.name}
Линия: ${info.line}
Эскалаторов: ${info.escalators}
Камер: ${info.cameras}
Инцидентов за 24ч: ${incidents}
Последний инцидент: ${info.lastIncident}`;
            } else {
                titleText = `${stationName}
Инцидентов за 24ч: ${incidents}
Статус: Мониторинг`;
            }
            
            titleElement.textContent = titleText;
            
            // Добавляем стили для hover эффекта
            circle.style.cursor = 'pointer';
            circle.style.transition = 'transform 0.2s ease, filter 0.2s ease';
            
            console.log(`Настроена станция: ${stationName} (ID: ${elementId})`);
        }
    });
    
    console.log(`Найдено и настроено ${circles.length} станций в SVG карте`);
}

// Создание демо SVG (в реальном проекте будет загружаться map.svg)
function createDemoSVG() {
    const stationRadius = isMobile ? '16' : '12';
    const lineWidth = isMobile ? '10' : '8';
    const fontSize = isMobile ? '14' : '12';
    
    return `
        <svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
            <!-- Сокольническая линия -->
            <line x1="50" y1="300" x2="750" y2="300" stroke="#ed1b35" stroke-width="${lineWidth}"/>
            
            <!-- Замоскворецкая линия -->
            <line x1="400" y1="50" x2="400" y2="550" stroke="#44b85c" stroke-width="${lineWidth}"/>
            
            <!-- Станции Сокольнической линии -->
            <circle id="s1_1_Sokolniki" class="metro-station" cx="100" cy="300" r="${stationRadius}" fill="white" stroke="#ed1b35" stroke-width="4" data-station="Сокольники"/>
            <text x="100" y="${isMobile ? '275' : '285'}" text-anchor="middle" font-size="${fontSize}" fill="var(--text-primary)" font-weight="500">Сокольники</text>
            
            <circle id="s1_Krasniye_Vorota" class="metro-station" cx="200" cy="300" r="${stationRadius}" fill="white" stroke="#ed1b35" stroke-width="4" data-station="Красные ворота"/>
            <text x="200" y="${isMobile ? '275' : '285'}" text-anchor="middle" font-size="${fontSize}" fill="var(--text-primary)" font-weight="500">Красные ворота</text>
            
            <circle id="s1_1_Chistye_Prudy" class="metro-station" cx="300" cy="300" r="${stationRadius}" fill="white" stroke="#ed1b35" stroke-width="4" data-station="Чистые пруды"/>
            <text x="300" y="${isMobile ? '275' : '285'}" text-anchor="middle" font-size="${fontSize}" fill="var(--text-primary)" font-weight="500">Чистые пруды</text>
            
            <circle id="s1_2_Lubyanka" class="metro-station" cx="400" cy="300" r="${stationRadius}" fill="white" stroke="#ed1b35" stroke-width="4" data-station="Лубянка"/>
            <text x="400" y="${isMobile ? '275' : '285'}" text-anchor="middle" font-size="${fontSize}" fill="var(--text-primary)" font-weight="500">Лубянка</text>
            
            <circle id="s1_1_Okhotny_Ryad" class="metro-station" cx="500" cy="300" r="${stationRadius}" fill="white" stroke="#ed1b35" stroke-width="4" data-station="Охотный ряд"/>
            <text x="500" y="${isMobile ? '275' : '285'}" text-anchor="middle" font-size="${fontSize}" fill="var(--text-primary)" font-weight="500">Охотный ряд</text>
            
            <circle id="s1_2_Park_Kultury" class="metro-station" cx="600" cy="300" r="${stationRadius}" fill="white" stroke="#ed1b35" stroke-width="4" data-station="Парк культуры"/>
            <text x="600" y="${isMobile ? '275' : '285'}" text-anchor="middle" font-size="${fontSize}" fill="var(--text-primary)" font-weight="500">Парк культуры</text>
            
            <!-- Станции Замоскворецкой линии -->
            <circle id="s2_7_Tverskaya" class="metro-station" cx="400" cy="150" r="${stationRadius}" fill="white" stroke="#44b85c" stroke-width="4" data-station="Тверская"/>
            <text x="400" y="${isMobile ? '125' : '135'}" text-anchor="middle" font-size="${fontSize}" fill="var(--text-primary)" font-weight="500">Тверская</text>
            
            <circle id="s2_3_Teatralnaya" class="metro-station" cx="400" cy="250" r="${stationRadius}" fill="white" stroke="#44b85c" stroke-width="4" data-station="Театральная"/>
            <text x="430" y="255" text-anchor="start" font-size="${fontSize}" fill="var(--text-primary)" font-weight="500">Театральная</text>
            
            <circle id="s2_2_Novokuznetskaya" class="metro-station" cx="400" cy="350" r="${stationRadius}" fill="white" stroke="#44b85c" stroke-width="4" data-station="Новокузнецкая"/>
            <text x="430" y="355" text-anchor="start" font-size="${fontSize}" fill="var(--text-primary)" font-weight="500">Новокузнецкая</text>
            
            <circle id="s2_3_Paveletskaya" class="metro-station" cx="400" cy="450" r="${stationRadius}" fill="white" stroke="#44b85c" stroke-width="4" data-station="Павелецкая"/>
            <text x="400" y="${isMobile ? '475' : '465'}" text-anchor="middle" font-size="${fontSize}" fill="var(--text-primary)" font-weight="500">Павелецкая</text>
        </svg>
    `;
}

// Настройка интерактивности SVG
function setupSVGInteractivity() {
    if (!svgElement) return;

    // Добавляем обработчики для станций
    const stations = svgElement.querySelectorAll('.metro-station');
    stations.forEach(station => {
        station.style.cursor = 'pointer';
        
        // Основные обработчики
        station.addEventListener('click', handleStationClick);
        
        // Hover эффекты только для desktop
        if (!('ontouchstart' in window)) {
            station.addEventListener('mouseenter', handleStationHover);
            station.addEventListener('mouseleave', handleStationLeave);
            
            // Дополнительные hover эффекты
            station.addEventListener('mouseenter', (e) => {
                e.target.style.transform = 'scale(1.2)';
                e.target.style.filter = 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.6))';
                e.target.style.zIndex = '10';
            });
            
            station.addEventListener('mouseleave', (e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.filter = 'none';
                e.target.style.zIndex = 'auto';
            });
        }
    });

    // Touch события для мобильных устройств
    if (isMobile) {
        setupTouchEvents();
    } else {
        // Настройка drag & drop для desktop
        svgElement.addEventListener('mousedown', startDragging);
        svgElement.addEventListener('mousemove', drag);
        svgElement.addEventListener('mouseup', stopDragging);
        svgElement.addEventListener('mouseleave', stopDragging);
        svgElement.addEventListener('wheel', handleWheel);
    }
    
    console.log(`Настроена интерактивность для ${stations.length} станций`);
}

// Touch events for mobile gestures
function setupTouchEvents() {
    if (!svgElement) return;

    let touchStartX, touchStartY;
    let lastTouchDistance = 0;
    let isMultiTouch = false;

    svgElement.addEventListener('touchstart', (e) => {
        e.preventDefault();
        
        if (e.touches.length === 1) {
            // Single touch - start dragging
            const touch = e.touches[0];
            touchStartX = touch.clientX - panX;
            touchStartY = touch.clientY - panY;
            isDragging = true;
            isMultiTouch = false;
        } else if (e.touches.length === 2) {
            // Multi-touch - prepare for zoom
            isMultiTouch = true;
            isDragging = false;
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            lastTouchDistance = Math.sqrt(
                Math.pow(touch2.clientX - touch1.clientX, 2) +
                Math.pow(touch2.clientY - touch1.clientY, 2)
            );
        }
    }, { passive: false });

    svgElement.addEventListener('touchmove', (e) => {
        e.preventDefault();
        
        if (e.touches.length === 1 && isDragging && !isMultiTouch) {
            // Single touch - dragging
            const touch = e.touches[0];
            panX = touch.clientX - touchStartX;
            panY = touch.clientY - touchStartY;
            updateTransform();
        } else if (e.touches.length === 2 && isMultiTouch) {
            // Multi-touch - zooming
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            const currentDistance = Math.sqrt(
                Math.pow(touch2.clientX - touch1.clientX, 2) +
                Math.pow(touch2.clientY - touch1.clientY, 2)
            );
            
            if (lastTouchDistance > 0) {
                const scale = currentDistance / lastTouchDistance;
                zoomMap(scale);
            }
            lastTouchDistance = currentDistance;
        }
    }, { passive: false });

    svgElement.addEventListener('touchend', (e) => {
        e.preventDefault();
        isDragging = false;
        isMultiTouch = false;
        lastTouchDistance = 0;
    }, { passive: false });
}

// Обработка наведения на станцию
function handleStationHover(event) {
    const stationName = event.target.getAttribute('data-station');
    if (stationName) {
        const info = stationInfo[stationName];
        const incidents = incidentData[stationName] || 0;
        
        updateStationInfo(stationName, info || {name: stationName}, incidents);
    }
}

// Обработка клика по станции
function handleStationClick(event) {
    event.stopPropagation();
    const stationName = event.target.getAttribute('data-station');
    if (stationName) {
        vibrateFeedback([20]); // Vibration feedback
        
        const info = stationInfo[stationName];
        const incidents = incidentData[stationName] || 0;
        
        updateStationInfo(stationName, info || {name: stationName}, incidents);
        
        if (isMobile) {
            // На мобильных показываем информационную панель
            if (!mapInfoOpen) {
                toggleMobileMapInfo();
            }
            // Закрываем мобильные контролы если открыты
            if (mobileControlsOpen) {
                toggleMobileControls();
            }
        } else {
            // На десктопе показываем детали
            if (info) {
                showStationDetails(stationName);
            } else {
                alert(`Станция: ${stationName}\nИнцидентов за 24ч: ${incidents}\n\nДетальная информация будет загружена из базы данных.`);
            }
        }
    }
}

// Обновление информации о станции
function updateStationInfo(stationName, info, incidents) {
    let content;
    if (info && info.name) {
        content = `
            <strong>${info.name}</strong><br>
            Линия: ${info.line || 'Неизвестно'}<br>
            Координаты: ${info.coords || 'Неизвестно'}<br>
            Эскалаторов: ${info.escalators || 'Неизвестно'}<br>
            Камер: ${info.cameras || 'Неизвестно'}<br>
            Инцидентов за 24ч: ${incidents}<br>
            Последний инцидент: ${info.lastIncident || 'Неизвестно'}
        `;
    } else {
        content = `
            <strong>${stationName}</strong><br>
            Инцидентов за 24ч: ${incidents}<br>
            Статус: Мониторинг<br>
            <small>Данные будут загружены из БД</small>
        `;
    }
    
    // Обновляем обе информационные панели
    const stationInfoElement = document.getElementById('station-info');
    const stationInfoMobileElement = document.getElementById('station-info-mobile');
    
    if (stationInfoElement) {
        stationInfoElement.innerHTML = content;
    }
    if (stationInfoMobileElement) {
        stationInfoMobileElement.innerHTML = content;
    }
}

// Обработка ухода курсора со станции
function handleStationLeave() {
    if (!isMobile) {
        const stationInfoElement = document.getElementById('station-info');
        if (stationInfoElement) {
            stationInfoElement.innerHTML = 'Кликните на станцию для получения информации';
        }
    }
}

// Показ деталей станции
function showStationDetails(stationName) {
    const info = stationInfo[stationName];
    const incidents = incidentData[stationName] || 0;
    
    if (info) {
        alert(`Станция: ${info.name}
Линия: ${info.line}
Координаты: ${info.coords}
Эскалаторов: ${info.escalators}
Камер: ${info.cameras}
Инцидентов за 24 часа: ${incidents}
Последний инцидент: ${info.lastIncident}

В реальном приложении здесь откроется детальная страница станции.`);
    }
}

// Применение тепловой карты
function applyHeatmap() {
    if (!svgElement || !showHeatmap) return;

    const stations = svgElement.querySelectorAll('.metro-station');
    stations.forEach(station => {
        const stationName = station.getAttribute('data-station');
        const incidents = incidentData[stationName] || 0;
        
        let color = '#6b7280'; // По умолчанию серый
        let animation = '';
        
        if (incidents === 0) {
            color = '#22c55e'; // Зелёный
        } else if (incidents <= 2) {
            color = '#f59e0b'; // Жёлтый
        } else {
            color = '#ef4444'; // Красный
            animation = 'pulse 2s infinite';
        }
        
        // Сохраняем оригинальные значения stroke и fill
        const originalStroke = station.getAttribute('stroke') || station.style.stroke;
        const originalFill = station.getAttribute('fill') || station.style.fill;
        
        // Применяем цвета тепловой карты
        station.setAttribute('fill', color);
        station.style.animation = animation;
        
        // Сохраняем оригинальные значения для восстановления
        station.setAttribute('data-original-stroke', originalStroke);
        station.setAttribute('data-original-fill', originalFill);
    });
    
    console.log(`Применена тепловая карта к ${stations.length} станциям`);
}

// Управление масштабированием
function zoomMap(factor) {
    currentZoom *= factor;
    
    // Different zoom limits for mobile vs desktop
    const minZoom = isMobile ? 0.3 : 0.5;
    const maxZoom = isMobile ? 8 : 5;
    
    currentZoom = Math.max(minZoom, Math.min(maxZoom, currentZoom));
    updateTransform();
    
    // Update coordinate display
    const coordDisplay = document.getElementById('coord-display');
    if (coordDisplay) {
        coordDisplay.textContent = `Масштаб: ${Math.round(currentZoom * 100)}%`;
    }
}

function centerMap() {
    panX = 0;
    panY = 0;
    currentZoom = 1;
    updateTransform();
    
    const coordDisplay = document.getElementById('coord-display');
    if (coordDisplay) {
        coordDisplay.textContent = showHeatmap ? 'Тепловая карта: инциденты за 24ч' : 'Обычный режим карты';
    }
    
    // Close mobile controls after action
    if (isMobile && mobileControlsOpen) {
        setTimeout(toggleMobileControls, 300);
    }
}

function resetView() {
    panX = 0;
    panY = 0;
    currentZoom = 1;
    showHeatmap = true;
    updateTransform();
    applyHeatmap();
    
    const coordDisplay = document.getElementById('coord-display');
    if (coordDisplay) {
        coordDisplay.textContent = 'Тепловая карта: инциденты за 24ч';
    }
    
    // Reset mobile button states
    if (isMobile) {
        const heatmapButton = document.querySelector('.mobile-control-btn:nth-child(4)');
        if (heatmapButton) {
            heatmapButton.style.backgroundColor = 'var(--primary-color)';
            heatmapButton.style.color = 'white';
        }
    }
    
    // Close mobile controls after action
    if (isMobile && mobileControlsOpen) {
        setTimeout(toggleMobileControls, 300);
    }
}

function updateTransform() {
    if (svgElement) {
        // Use transform3d for better mobile performance
        const transform = `translate3d(${panX}px, ${panY}px, 0) scale(${currentZoom})`;
        svgElement.style.transform = transform;
        svgElement.style.transformOrigin = 'center center';
        
        // Add will-change for better mobile performance during animations
        svgElement.style.willChange = 'transform';
        
        // Remove will-change after animation to save resources
        setTimeout(() => {
            if (svgElement) {
                svgElement.style.willChange = 'auto';
            }
        }, 500);
    }
}

// Обработка колесика мыши для зума
function handleWheel(event) {
    event.preventDefault();
    const delta = event.deltaY;
    const factor = delta > 0 ? 0.9 : 1.1;
    zoomMap(factor);
}

// Перетаскивание карты
function startDragging(event) {
    if (event.target.classList.contains('metro-station')) return;
    
    isDragging = true;
    startX = event.clientX - panX;
    startY = event.clientY - panY;
    if (svgElement) {
        svgElement.style.cursor = 'grabbing';
    }
}

function drag(event) {
    if (!isDragging) return;
    
    panX = event.clientX - startX;
    panY = event.clientY - startY;
    updateTransform();
}

function stopDragging() {
    isDragging = false;
    if (svgElement) {
        svgElement.style.cursor = 'grab';
    }
}

// Переключение тепловой карты
function toggleHeatmap() {
    showHeatmap = !showHeatmap;
    
    if (showHeatmap) {
        applyHeatmap();
        const coordDisplay = document.getElementById('coord-display');
        if (coordDisplay) {
            coordDisplay.textContent = 'Тепловая карта: инциденты за 24ч';
        }
        
        // Mobile feedback
        if (isMobile) {
            const button = document.querySelector('.mobile-control-btn:nth-child(4)');
            if (button) {
                button.style.backgroundColor = 'var(--primary-color)';
                button.style.color = 'white';
            }
        }
    } else {
        // Возвращаем оригинальные цвета
        const stations = svgElement.querySelectorAll('.metro-station');
        stations.forEach(station => {
            const originalFill = station.getAttribute('data-original-fill') || 'white';
            const originalStroke = station.getAttribute('data-original-stroke') || '#ed1b35';
            
            station.setAttribute('fill', originalFill);
            station.setAttribute('stroke', originalStroke);
            station.style.animation = '';
        });
        
        const coordDisplay = document.getElementById('coord-display');
        if (coordDisplay) {
            coordDisplay.textContent = 'Обычный режим карты';
        }
        
        // Reset mobile button
        if (isMobile) {
            const button = document.querySelector('.mobile-control-btn:nth-child(4)');
            if (button) {
                button.style.backgroundColor = '';
                button.style.color = '';
            }
        }
    }
    
    // Close mobile controls after action
    if (isMobile && mobileControlsOpen) {
        setTimeout(toggleMobileControls, 300);
    }
}

// Window resize handler
function handleResize() {
    const wasMobile = isMobile;
    isMobile = window.innerWidth <= 768;
    
    // If switching between mobile/desktop, reinitialize interactions
    if (wasMobile !== isMobile && svgElement) {
        setupSVGInteractivity();
    }
    
    // Close mobile nav if switching to desktop
    const mobileNav = document.getElementById('mobile-nav');
    if (!isMobile && mobileNav) {
        mobileNav.classList.remove('active');
    }
    
    // Show/hide user info based on screen size
    const userInfo = document.querySelector('.user-info');
    if (userInfo) {
        userInfo.style.display = isMobile ? 'none' : 'block';
    }
}

// Export functionality
function exportChart(chartId) {
    const chart = document.getElementById(chartId);
    if (!chart) return;
    
    const formatSelect = chart.parentElement.querySelector('.export-select');
    const format = formatSelect ? formatSelect.value : 'pdf';
    
    // Simulate export process
    const chartTitle = chart.parentElement.querySelector('.card-title').textContent;
    
    // Show loading state
    const exportBtn = chart.parentElement.querySelector('.export-btn');
    if (exportBtn) {
        const originalText = exportBtn.innerHTML;
        exportBtn.innerHTML = '⏳ Экспорт...';
        exportBtn.disabled = true;
        
        setTimeout(() => {
            alert(`Экспорт "${chartTitle}" в формате ${format.toUpperCase()} завершен`);
            exportBtn.innerHTML = originalText;
            exportBtn.disabled = false;
            
            // In real implementation, this would trigger file download
            console.log(`Exporting ${chartId} as ${format}`);
        }, 2000);
    }
}

function generateReport(reportType) {
    const formatSelect = document.getElementById(`${reportType}-format`);
    const format = formatSelect ? formatSelect.value : 'pdf';
    
    const reportNames = {
        'daily': 'Ежедневный отчет',
        'weekly': 'Еженедельный отчет', 
        'monthly': 'Месячный отчет',
        'station': 'Отчет по станции'
    };
    
    const reportName = reportNames[reportType] || reportType;
    
    // Simulate report generation
    alert(`Генерация "${reportName}" в формате ${format.toUpperCase()} начата. Файл будет доступен для скачивания через несколько секунд.`);
    
    // In real implementation, this would call backend API
    console.log(`Generating ${reportType} report in ${format} format`);
}

// Modal functions
function viewIncident(incidentId) {
    const modal = document.getElementById('incident-modal');
    if (modal) {
        modal.classList.add('active');
    }
}

function closeModal() {
    const modal = document.getElementById('incident-modal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function createIncident() {
    alert('Форма создания нового инцидента');
}

function viewStation(stationId) {
    alert(`Просмотр деталей станции: ${stationId}`);
}

// Initialize mobile controls toggle
function initMobileControls() {
    const mobileControlsToggle = document.getElementById('mobile-controls-toggle');
    if (mobileControlsToggle) {
        mobileControlsToggle.addEventListener('click', toggleMobileControls);
    }
}

// Close mobile controls when clicking outside
function setupOutsideClickHandlers() {
    document.addEventListener('click', (e) => {
        const mobileControls = document.querySelector('.mobile-controls');
        const mobileControlsPanel = document.getElementById('mobile-controls-panel');
        
        if (mobileControlsOpen && mobileControls && !mobileControls.contains(e.target)) {
            toggleMobileControls();
        }
    });

    // Close modal when clicking outside
    const incidentModal = document.getElementById('incident-modal');
    if (incidentModal) {
        incidentModal.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                closeModal();
            }
        });
    }
}

// Initialize everything when DOM is loaded
function initializeApp() {
    console.log('Initializing EscControl application...');
    
    // Initialize all components
    initThemeToggle();
    initMobileNavigation();
    initDesktopNavigation();
    initMobileControls();
    setupOutsideClickHandlers();
    
    // Set initial mobile state
    isMobile = window.innerWidth <= 768;
    
    // Show/hide user info based on initial screen size
    const userInfo = document.querySelector('.user-info');
    if (userInfo) {
        userInfo.style.display = isMobile ? 'none' : 'block';
    }

    // Add window resize listener
    window.addEventListener('resize', handleResize);
    
    // Load metro map with delay for proper initialization
    setTimeout(() => {
        loadMetroMap();
    }, 100);

    console.log('EscControl application initialized successfully');
}

// Simulate real-time updates
function startRealTimeUpdates() {
    setInterval(() => {
        // In real implementation, this would fetch updates from the server
        // and update the UI accordingly
        console.log('Checking for updates...');
    }, 30000); // Check every 30 seconds
}

// Wait for DOM to be fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// Start real-time updates
startRealTimeUpdates();