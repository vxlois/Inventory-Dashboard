import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://uzrolsfaklkzwezgmfaz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6cm9sc2Zha2xrendlemdtZmF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5MDQyMjIsImV4cCI6MjA3MzQ4MDIyMn0.SJ5XoVy6CS70kpIjzsdH6G6azwJILYge-s6S8lryAuE';

// Initialize Supabase Client
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// --- Global State ---
let CURRENT_DASHBOARD_DATA: any = null;
let RAW_PRODUCT_LIST: any[] = [];
let CURRENT_PAGE = 1;
const ITEMS_PER_PAGE = 100;

// --- Chart.js Setup ---
declare var Chart: any;
const chartInstances: { [key: string]: any } = {};

// Theme Colors
const THEME_COLORS = {
    emerald: '#2dd4bf', 
    amber: '#f59e0b', 
    blue: '#3b82f6', 
    purple: '#a855f7', 
    pink: '#ec4899',
    red: '#ef4444',
    gray: '#71717a',
    grid: 'rgba(255, 255, 255, 0.05)',
    text: '#a1a1aa',
    tooltipBg: 'rgba(9, 9, 11, 0.95)',
    bg: '#09090b'
};

const STATUS_COLORS = {
    'In Stock': THEME_COLORS.emerald,
    'Low Stock': THEME_COLORS.amber,
    'Out of Stock': THEME_COLORS.red,
    'On Order': THEME_COLORS.blue
};

// --- Helper Functions ---
const commonBarDatasetConfig = {
    borderRadius: 6, 
    borderSkipped: false,
    barPercentage: 0.65,
    categoryPercentage: 0.8,
    maxBarThickness: 50,
};

// Gradient Helper
function createGradient(colorStart: string, colorEnd: string, isHorizontal: boolean = false) {
    return (context: any) => {
        const chart = context.chart;
        const { ctx, chartArea } = chart;
        if (!chartArea) return colorStart;
        
        const gradient = isHorizontal 
            ? ctx.createLinearGradient(chartArea.left, 0, chartArea.right, 0)
            : ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
            
        gradient.addColorStop(0, colorStart);
        gradient.addColorStop(1, colorEnd);
        return gradient;
    };
}

function showToast(message: string, type: 'success' | 'error' | 'info' | 'realtime' = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = '';
    if (type === 'success') icon = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>';
    else if (type === 'error') icon = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>';
    else if (type === 'realtime') icon = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>';
    else icon = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';

    toast.innerHTML = `<div style="display:flex; align-items:center; gap:8px;">${icon}<span>${message}</span></div>`;

    container.appendChild(toast);
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Ensure Chart defaults are set if available
try {
    if (typeof Chart !== 'undefined') {
        Chart.defaults.font.family = "'Inter', sans-serif";
        Chart.defaults.color = THEME_COLORS.text;
    }
} catch (e) { console.warn('Chart.js not loaded yet'); }

const commonChartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    resizeDelay: 200,
    animation: { duration: 600, easing: 'easeOutQuart' },
    layout: { padding: { top: 10, bottom: 10, left: 0, right: 10 } },
    plugins: {
        tooltip: {
            enabled: true,
            backgroundColor: THEME_COLORS.tooltipBg,
            titleColor: '#ffffff',
            bodyColor: '#e4e4e7',
            padding: 12,
            cornerRadius: 8,
            titleFont: { family: "'Inter', sans-serif", weight: '600', size: 13 },
            bodyFont: { family: "'Inter', sans-serif", size: 12 },
            borderColor: 'rgba(255,255,255,0.1)',
            borderWidth: 1,
            displayColors: true,
            boxPadding: 4,
            usePointStyle: true,
        },
        legend: {
            position: 'top' as const,
            align: 'end' as const,
            labels: { color: THEME_COLORS.text, font: { family: "'Inter', sans-serif", size: 11, weight: 500 }, padding: 15, usePointStyle: true, pointStyle: 'circle', boxWidth: 6, boxHeight: 6 }
        },
        zoom: false
    },
    scales: {
        y: { 
            beginAtZero: true, 
            grid: { color: THEME_COLORS.grid, drawBorder: false }, 
            border: { display: false }, 
            ticks: { color: THEME_COLORS.text, padding: 8, font: { size: 11 } } 
        },
        x: { 
            grid: { display: false, drawBorder: false }, 
            border: { display: false }, 
            ticks: { color: THEME_COLORS.text, autoSkip: true, maxRotation: 0, font: { size: 11 }, padding: 8 } 
        }
    }
};

function renderChart(canvasId: string, config: any) {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Safety destroy
    if (chartInstances[canvasId]) { 
        try {
            chartInstances[canvasId].destroy(); 
        } catch(e) { console.error('Error destroying chart', e); }
        delete chartInstances[canvasId]; 
    }
    
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    try { 
        if(typeof Chart !== 'undefined') {
            chartInstances[canvasId] = new Chart(ctx, config); 
        } else {
            console.error('Chart is undefined');
        }
    } catch(err) { 
        console.error(`Failed to render chart ${canvasId}:`, err); 
    }
}

function updateChartsTheme(isLight: boolean) {
    const gridColor = isLight ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)';
    const textColor = isLight ? '#71717a' : '#a1a1aa';
    const tooltipBg = isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(9, 9, 11, 0.95)';
    const borderColor = isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)';
    Object.values(chartInstances).forEach(chart => {
        if (chart.options.scales?.x) chart.options.scales.x.ticks.color = textColor;
        if (chart.options.scales?.y) { chart.options.scales.y.grid.color = gridColor; chart.options.scales.y.ticks.color = textColor; }
        if (chart.options.plugins?.legend) chart.options.plugins.legend.labels.color = textColor;
        if (chart.options.plugins?.tooltip) { chart.options.plugins.tooltip.backgroundColor = tooltipBg; chart.options.plugins.tooltip.borderColor = borderColor; chart.options.plugins.tooltip.titleColor = isLight ? '#1f2328' : '#ffffff'; chart.options.plugins.tooltip.bodyColor = isLight ? '#57606a' : '#e4e4e7'; }
        chart.update();
    });
}

function truncateLabel(label: string, maxLength = 16): string {
    if (!label || typeof label !== 'string') return String(label || '');
    return label.length > maxLength ? label.substring(0, maxLength - 2) + '..' : label;
}

function updateConnectionStatus(status: 'CONNECTING' | 'LIVE' | 'ERROR' | 'RECONNECTING' | 'OFFLINE') {
    const el = document.getElementById('connectionStatus');
    if (!el) return;
    el.className = 'badge'; 
    let html = '';
    switch (status) {
        case 'LIVE': el.classList.add('badge-success', 'live-pulse'); html = '<span class="status-dot"></span> LIVE'; break;
        case 'CONNECTING': case 'RECONNECTING': el.classList.add('badge-warning'); html = 'Connecting...'; break;
        case 'ERROR': case 'OFFLINE': el.classList.add('badge-danger'); html = 'Offline'; break;
    }
    el.innerHTML = html;
}

// --- Chart Render Functions (Improved Visuals) ---

function renderInventoryStatusChart(data: { [key: string]: number }) {
    renderChart('inventoryStatusChart', {
        type: 'doughnut',
        data: {
            labels: Object.keys(data),
            datasets: [{ 
                label: 'Items', 
                data: Object.values(data), 
                backgroundColor: Object.keys(data).map(status => STATUS_COLORS[status as keyof typeof STATUS_COLORS] || THEME_COLORS.gray), 
                borderWidth: 0, 
                hoverOffset: 4,
                cutout: '70%'
            }]
        },
        options: { 
            ...commonChartOptions, 
            plugins: { 
                ...commonChartOptions.plugins, 
                legend: { ...commonChartOptions.plugins.legend, position: 'right' as const, align: 'center' as const },
                zoom: false
            }, 
            scales: { x: { display: false }, y: { display: false } } 
        }
    });
}

function renderInventoryByLocationChart(data: any[]) {
    renderChart('inventoryByLocationChart', { 
        type: 'bar', 
        data: { 
            labels: data.map(i => i.location_name), 
            datasets: [{ 
                label: 'Total Stock', 
                data: data.map(i => i.total_stock), 
                backgroundColor: createGradient(THEME_COLORS.emerald, '#34d399'), 
                hoverBackgroundColor: '#34d399', 
                ...commonBarDatasetConfig 
            }] 
        }, 
        options: { 
            ...commonChartOptions,
            plugins: { ...commonChartOptions.plugins, zoom: false },
            scales: {
                ...commonChartOptions.scales,
                x: {
                    ...commonChartOptions.scales.x,
                    ticks: {
                        ...commonChartOptions.scales.x.ticks,
                        callback: function(val: any) { 
                            // Safety check for method existence
                            const label = this.getLabelForValue ? this.getLabelForValue(val) : val;
                            return truncateLabel(label, 12); 
                        }
                    }
                }
            }
        } 
    });
}

function renderTop10MostStockedChart(data: any[]) {
    const top10 = data.slice(0, 10);
    renderChart('top10MostStockedChart', { 
        type: 'bar', 
        data: { 
            labels: top10.map(p => p.product_name), 
            datasets: [{ 
                label: 'Stock Level', 
                data: top10.map(p => p.total_stock), 
                backgroundColor: createGradient(THEME_COLORS.blue, '#22d3ee', true), // Blue to Cyan horizontal gradient
                hoverBackgroundColor: '#60a5fa', 
                ...commonBarDatasetConfig,
                borderRadius: { topRight: 6, bottomRight: 6, topLeft: 0, bottomLeft: 0 }
            }] 
        }, 
        options: { 
            ...commonChartOptions, 
            indexAxis: 'y', // Horizontal bars
            plugins: { ...commonChartOptions.plugins, legend: {display: false} },
            scales: {
                x: { ...commonChartOptions.scales.x, grid: { color: THEME_COLORS.grid, drawBorder: false }, display: true },
                y: { 
                    ...commonChartOptions.scales.y, 
                    grid: { display: false },
                    ticks: {
                        ...commonChartOptions.scales.y.ticks,
                        callback: function(val: any) { 
                            const label = this.getLabelForValue ? this.getLabelForValue(val) : val;
                            return truncateLabel(label, 20); 
                        }
                    }
                }
            }
        } 
    });
}

function renderTop5SuppliersChart(data: any[]) {
    renderChart('top5SuppliersChart', { 
        type: 'bar', 
        data: { 
            labels: data.map(s => s.supplier_name), 
            datasets: [{ 
                label: 'Items Supplied', 
                data: data.map(s => s.total_items_supplied), 
                backgroundColor: createGradient('#7c3aed', '#ec4899'), // Purple to Pink gradient
                hoverBackgroundColor: '#c084fc', 
                ...commonBarDatasetConfig 
            }] 
        }, 
        options: { 
            ...commonChartOptions, 
            plugins: { ...commonChartOptions.plugins, legend: {display:false} },
            scales: {
                ...commonChartOptions.scales,
                x: {
                    ...commonChartOptions.scales.x,
                    ticks: {
                        ...commonChartOptions.scales.x.ticks,
                        callback: function(val: any) { 
                             const label = this.getLabelForValue ? this.getLabelForValue(val) : val;
                             return truncateLabel(label, 15); 
                        }
                    }
                }
            }
        } 
    });
}

function renderUpcomingDeliveriesChart(data: any[]) {
    data.sort((a,b) => new Date(a.expected_delivery_date).getTime() - new Date(b.expected_delivery_date).getTime());
    
    // Smooth Area Chart
    renderChart('upcomingDeliveriesChart', { 
        type: 'line', 
        data: { 
            labels: data.map(d => new Date(d.expected_delivery_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })), 
            datasets: [{ 
                label: 'Incoming Items', 
                data: data.map(d => d.items_expected), 
                borderColor: THEME_COLORS.emerald, 
                borderWidth: 2, 
                backgroundColor: (context: any) => { 
                    const chart = context.chart; 
                    const {ctx, chartArea} = chart; 
                    if (!chartArea) return null; 
                    const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom); 
                    gradient.addColorStop(0, 'rgba(45, 212, 191, 0.4)'); 
                    gradient.addColorStop(1, 'rgba(45, 212, 191, 0.0)'); 
                    return gradient; 
                }, 
                fill: true, 
                tension: 0.4, 
                pointRadius: 3, 
                pointBackgroundColor: THEME_COLORS.bg, 
                pointBorderColor: THEME_COLORS.emerald, 
                pointBorderWidth: 2, 
                pointHoverRadius: 6, 
            }] 
        }, 
        options: { 
            ...commonChartOptions, 
            interaction: { mode: 'index', intersect: false }, 
            plugins: { 
                ...commonChartOptions.plugins, 
                legend: { display: false }, 
            }, 
            scales: { 
                y: { ...commonChartOptions.scales.y, borderDash: [4, 4] }, 
                x: { ...commonChartOptions.scales.x, grid: { display: false } } 
            } 
        } 
    });
}

// Replaces renderItemsToReorderChart - NOW AS A LIST
function renderItemsToReorderList(data: any[]) {
    const container = document.getElementById('itemsToReorderContainer');
    if (!container) return;
    
    if (data.length === 0) {
        container.innerHTML = '<div style="padding:16px; color:var(--text-secondary); text-align:center;">All stock levels healthy.</div>';
        return;
    }
    
    // Sort: 0 stock first, then ascending stock
    data.sort((a, b) => {
        if (a.stock_level === 0 && b.stock_level !== 0) return -1;
        if (a.stock_level !== 0 && b.stock_level === 0) return 1;
        return a.stock_level - b.stock_level;
    });

    let html = '';
    data.forEach(item => {
        const isOut = item.stock_level === 0;
        const iconColor = isOut ? 'var(--danger-color)' : 'var(--warning-color)';
        const icon = isOut 
            ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>'
            : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>';

        html += `<div class="list-item reorder-grid">
            <div style="display:flex; align-items:center; gap:10px; overflow:hidden;">
                <div style="color:${iconColor}; flex-shrink:0;">${icon}</div>
                <div style="font-weight:500; font-size:0.9rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${item.product_name}">${item.product_name}</div>
            </div>
            <div style="font-size:0.9rem; color:var(--text-primary); text-align:center;">${item.stock_level}</div>
            <div style="font-size:0.9rem; color:var(--text-secondary); text-align:center;">${item.reorder_level}</div>
            <div style="font-size:0.8rem; color:var(--text-secondary); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${item.location_name || 'Unassigned'}</div>
        </div>`;
    });
    container.innerHTML = html;
}

function renderInventoryStatusByLocationChart(data: any[]) {
    const locations = [...new Set(data.map(item => item.location_name))];
    const statuses = ['In Stock', 'Low Stock', 'Out of Stock', 'On Order'];
    const datasets = statuses.map(status => ({ 
        label: status, 
        data: locations.map(location => { const item = data.find(d => d.location_name === location && d.status === status); return item ? item.item_count : 0; }), 
        backgroundColor: STATUS_COLORS[status as keyof typeof STATUS_COLORS] || THEME_COLORS.gray, 
        ...commonBarDatasetConfig,
        barThickness: 20
    }));
    
    renderChart('inventoryStatusByLocationChart', { 
        type: 'bar', 
        data: { labels: locations, datasets }, 
        options: { 
            ...commonChartOptions, 
            scales: { 
                x: { 
                    ...commonChartOptions.scales.x, 
                    stacked: true,
                    ticks: {
                        ...commonChartOptions.scales.x.ticks,
                        callback: function(val: any) { 
                             const label = this.getLabelForValue ? this.getLabelForValue(val) : val;
                             return truncateLabel(label, 15); 
                        }
                    }
                }, 
                y: { ...commonChartOptions.scales.y, stacked: true } 
            } 
        } 
    });
}

function renderAvgItemsBySupplierChart(data: any[]) {
    if (!data || data.length === 0) { const canvas = document.getElementById('avgItemsBySupplierChart') as HTMLCanvasElement; if(canvas) { const ctx = canvas.getContext('2d'); if(ctx) ctx.clearRect(0,0, canvas.width, canvas.height); } return; }
    
    // Sort and take top 10
    const top10 = data.slice(0, 10);
    
    // Lollipop Chart (Mixed Chart: Bar + Line as point)
    renderChart('avgItemsBySupplierChart', { 
        type: 'bar',
        data: { 
            labels: top10.map(s => s.supplier_name), 
            datasets: [
                { 
                    type: 'bar',
                    label: 'Avg Stock', 
                    data: top10.map(s => s.average_stock), 
                    backgroundColor: THEME_COLORS.emerald, // Green Stick
                    barThickness: 2, 
                    borderRadius: 0 
                },
                {
                    type: 'line',
                    label: 'Avg Stock (Point)',
                    data: top10.map(s => s.average_stock),
                    backgroundColor: THEME_COLORS.bg, // Hollow center
                    borderColor: THEME_COLORS.emerald, // Green border
                    borderWidth: 2,
                    pointRadius: 6, 
                    pointHoverRadius: 8,
                    showLine: false,
                    tooltip: { enabled: false } 
                }
            ] 
        }, 
        options: { 
            ...commonChartOptions, 
            indexAxis: 'y', // Horizontal
            plugins: { ...commonChartOptions.plugins, legend: {display:false} },
            scales: {
                x: { ...commonChartOptions.scales.x, grid: { color: THEME_COLORS.grid, drawBorder: false }, display: true },
                y: { 
                    ...commonChartOptions.scales.y, 
                    grid: { display: false },
                    ticks: {
                        ...commonChartOptions.scales.y.ticks,
                        callback: function(val: any) { 
                             const label = this.getLabelForValue ? this.getLabelForValue(val) : val;
                             return truncateLabel(label, 20); 
                        }
                    }
                }
            }
        } 
    });
}

function renderRestockFrequencyChart(data: any[]) {
    const topItems = data.sort((a, b) => b.restock_count - a.restock_count).slice(0, 10);
    if (topItems.length === 0) { const canvas = document.getElementById('restockFrequencyChart') as HTMLCanvasElement; if(canvas) { const ctx = canvas.getContext('2d'); if(ctx) ctx.clearRect(0,0, canvas.width, canvas.height); } return; }
    
    renderChart('restockFrequencyChart', { 
        type: 'bar', 
        data: { 
            labels: topItems.map(i => i.product_name), 
            datasets: [{ 
                label: 'Times Restocked', 
                data: topItems.map(i => i.restock_count), 
                backgroundColor: createGradient(THEME_COLORS.amber, '#fbbf24'), // Amber Gradient
                hoverBackgroundColor: '#fbbf24', 
                ...commonBarDatasetConfig 
            }] 
        }, 
        options: { 
            ...commonChartOptions, 
            scales: { 
                x: { 
                    ...commonChartOptions.scales.x, 
                    grid: { display: false },
                    ticks: {
                        ...commonChartOptions.scales.x.ticks,
                        callback: function(val: any) { 
                             const label = this.getLabelForValue ? this.getLabelForValue(val) : val;
                             return truncateLabel(label, 15); 
                        }
                    }
                }, 
                y: { ...commonChartOptions.scales.y, grid: { color: THEME_COLORS.grid }, ticks: { ...commonChartOptions.scales.y.ticks, stepSize: 1 } } 
            }, 
            plugins: { ...commonChartOptions.plugins, legend: { display: false } } 
        } 
    });
}

function renderItemsWithoutDeliveryDates(data: any[]) {
    const container = document.getElementById('noDeliveryDatesContainer');
    if (!container) return;
    if (data.length === 0) { container.innerHTML = '<div style="padding:16px; color:var(--text-secondary); text-align:center;">All items have delivery dates set.</div>'; return; }
    let html = '';
    data.forEach(item => {
        html += `<div class="list-item delivery-grid"><div style="display:flex; align-items:center; gap:10px; overflow:hidden;"><div style="color:var(--warning-color); flex-shrink:0;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg></div><div style="font-weight:500; font-size:0.9rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${item.product_name}">${item.product_name}</div></div><div style="font-size:0.9rem; color:var(--text-secondary); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${item.supplier_name || 'N/A'}</div><div style="font-size:0.9rem; color:var(--text-primary); text-align:center;">${item.stock_level}</div><div style="font-size:0.8rem; color:var(--text-secondary); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${item.location_name || 'Unassigned'}</div></div>`;
    });
    container.innerHTML = html;
}

// --- STRICT Data Processing Logic (NO MOCK DATA) ---
function processProductData(products: any[]) {
    RAW_PRODUCT_LIST = products;
    
    // Initialize structures
    const inventoryStatus = { 'In Stock': 0, 'Low Stock': 0, 'Out of Stock': 0, 'On Order': 0 };
    const locMap: Record<string, number> = {};
    const supplierStats: Record<string, {count: number, sum: number, total_supplied: number}> = {};
    const locStatusMap: Record<string, Record<string, number>> = {};
    const itemsReorder: any[] = [];
    const itemsNoDate: any[] = [];
    const deliveryMap: Record<string, number> = {};
    let grandTotalValue = 0;

    const productAggMap = new Map<string, { total_stock: number, restock_count: number }>();
    
    products.forEach(p => {
        const stock = typeof p.stock_level === 'number' ? p.stock_level : parseInt(p.stock_level) || 0;
        const reorder = typeof p.reorder_level === 'number' ? p.reorder_level : parseInt(p.reorder_level) || 0;
        const price = typeof p.price === 'number' ? p.price : parseFloat(p.price) || 0.0;
        const rCount = typeof p.restock_count === 'number' ? p.restock_count : parseInt(p.restock_count) || 0;
        
        const productName = (p.product_name || 'Unknown Product').trim();
        const location = (p.location_name || 'Unassigned').trim();
        const supplier = (p.supplier_name || 'Unknown Supplier').trim();
        const deliveryDate = p.expected_delivery_date;
        const dbStatus = p.status;

        const totalValue = stock * price;
        grandTotalValue += totalValue;

        // Enhanced Status Logic for Reporting Accuracy
        let status = 'In Stock';
        if (dbStatus === 'On Order') status = 'On Order';
        else if (stock === 0) status = 'Out of Stock';
        else if (stock <= reorder) status = 'Low Stock';
        
        inventoryStatus[status] = (inventoryStatus[status] || 0) + 1;
        
        // Location Aggregates
        locMap[location] = (locMap[location] || 0) + stock;

        if (!locStatusMap[location]) locStatusMap[location] = { 'In Stock': 0, 'Low Stock': 0, 'Out of Stock': 0, 'On Order': 0 };
        locStatusMap[location][status]++;

        if (!supplierStats[supplier]) supplierStats[supplier] = { count: 0, sum: 0, total_supplied: 0 };
        supplierStats[supplier].count++; 
        supplierStats[supplier].sum += stock; 
        supplierStats[supplier].total_supplied += stock; 

        if (status !== 'On Order' && (status === 'Low Stock' || status === 'Out of Stock')) {
            itemsReorder.push({ product_name: productName, location_name: location, stock_level: stock, reorder_level: reorder });
        }
        
        if (!deliveryDate) {
            itemsNoDate.push({ product_name: productName, location_name: location, supplier_name: supplier, stock_level: stock, status: status });
        } else {
            const dateStr = new Date(deliveryDate).toDateString(); 
            deliveryMap[dateStr] = (deliveryMap[dateStr] || 0) + 1;
        }

        const currentAgg = productAggMap.get(productName) || { total_stock: 0, restock_count: 0 };
        currentAgg.total_stock += stock;
        currentAgg.restock_count += rCount; 
        productAggMap.set(productName, currentAgg);
    });

    const topProd = Array.from(productAggMap.entries())
        .map(([name, stats]) => ({ product_name: name, total_stock: stats.total_stock }))
        .sort((a,b) => b.total_stock - a.total_stock);

    const restockFreq = Array.from(productAggMap.entries())
        .map(([name, stats]) => ({ product_name: name, restock_count: stats.restock_count }))
        .filter(item => item.restock_count > 0)
        .sort((a,b) => b.restock_count - a.restock_count);

    const inventoryByLocation = Object.entries(locMap).map(([k,v]) => ({ location_name: k, total_stock: v }));
    
    const inventoryStatusByLocation: any[] = [];
    Object.entries(locStatusMap).forEach(([loc, stats]) => { Object.entries(stats).forEach(([stat, count]) => { if (count > 0) inventoryStatusByLocation.push({ location_name: loc, status: stat, item_count: count }); }); });
    
    const topSuppliers = Object.entries(supplierStats).map(([k,v]) => ({ supplier_name: k, total_items_supplied: v.total_supplied })).sort((a,b) => b.total_items_supplied - a.total_items_supplied).slice(0, 5);
    
    const avgStockBySupplier = Object.entries(supplierStats).map(([k,v]) => ({ 
        supplier_name: k, 
        average_stock: Math.round(v.sum / (v.count || 1)) 
    })).sort((a,b) => b.average_stock - a.average_stock);
    
    const upcomingDeliveries = Object.entries(deliveryMap).map(([k,v]) => ({ expected_delivery_date: k, items_expected: v }));

    return { inventoryStatus, inventoryByLocation, inventoryStatusByLocation, itemsToReorder: itemsReorder, topProducts: topProd, topSuppliers, avgStockBySupplier, itemsWithoutDelivery: itemsNoDate, upcomingDeliveries, restockFrequency: restockFreq, grandTotalValue };
}

// --- Data Fetching ---
async function fetchDashboardData(isManual = false) {
    if (isManual) showToast('Fetching data...', 'info');
    try {
        const { data, error } = await supabase.from('inventory').select('*');
        if (error) {
            console.error("Supabase Error (Inventory):", error);
            updateConnectionStatus('ERROR');
            showToast('Failed to fetch data: ' + error.message, 'error');
            CURRENT_DASHBOARD_DATA = processProductData([]);
            renderInventoryTable([]);
        } else {
            if (data.length === 0 && isManual) showToast('Fetched 0 items.', 'info');
            else if (isManual) showToast(`Synced`, 'success');
            CURRENT_DASHBOARD_DATA = processProductData(data || []);
            renderInventoryTable(data || []);
        }
        renderDashboard(CURRENT_DASHBOARD_DATA);
    } catch (e) {
        console.error("Fetch error:", e);
        updateConnectionStatus('ERROR');
        showToast('Network error', 'error');
        CURRENT_DASHBOARD_DATA = processProductData([]);
        renderDashboard(CURRENT_DASHBOARD_DATA);
        renderInventoryTable([]);
    }
}

// --- Rendering Logic ---

function updateQuickStats(data: any) {
    const totalStock = data.inventoryByLocation.reduce((acc: any, curr: any) => acc + curr.total_stock, 0);
    const statTotalStock = document.getElementById('statTotalStock');
    if (statTotalStock) statTotalStock.textContent = totalStock.toLocaleString();

    const lowStockCount = (data.inventoryStatus['Low Stock'] || 0) + (data.inventoryStatus['Out of Stock'] || 0);
    const statLowStock = document.getElementById('statLowStock');
    if (statLowStock) statLowStock.textContent = lowStockCount.toLocaleString();

    const incoming = data.upcomingDeliveries.reduce((acc: any, curr: any) => acc + curr.items_expected, 0);
    const statIncoming = document.getElementById('statIncoming');
    if (statIncoming) statIncoming.textContent = incoming.toLocaleString();

    const totalValue = data.grandTotalValue || 0;
    const statValue = document.getElementById('statValue');
    if (statValue) {
        // Updated to always show commas and 2 decimal places
        statValue.textContent = '₱' + totalValue.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    }
    
    const timeEl = document.getElementById('lastUpdatedTime');
    if (timeEl) timeEl.textContent = new Date().toLocaleTimeString();
}

function renderDashboard(data: any) {
    if(!data) return;
    updateQuickStats(data);
    renderInventoryStatusChart(data.inventoryStatus);
    renderInventoryByLocationChart(data.inventoryByLocation);
    renderTop10MostStockedChart(data.topProducts);
    renderTop5SuppliersChart(data.topSuppliers);
    renderItemsToReorderList(data.itemsToReorder);
    renderUpcomingDeliveriesChart(data.upcomingDeliveries);
    renderInventoryStatusByLocationChart(data.inventoryStatusByLocation);
    renderAvgItemsBySupplierChart(data.avgStockBySupplier);
    renderRestockFrequencyChart(data.restockFrequency);
    renderItemsWithoutDeliveryDates(data.itemsWithoutDelivery || []);
}

function renderInventoryTable(data: any[]) {
    const container = document.getElementById('inventoryTableContainer');
    const controls = document.getElementById('paginationControls');
    const info = document.getElementById('paginationInfo');
    const prevBtn = document.getElementById('btnPrevPage') as HTMLButtonElement;
    const nextBtn = document.getElementById('btnNextPage') as HTMLButtonElement;

    if (!container || !controls || !info || !prevBtn || !nextBtn) return;
    
    if (data.length === 0) {
        container.innerHTML = `<div style="text-align:center; padding: 40px; color: var(--text-muted);"><p>No inventory found.</p></div>`;
        controls.style.display = 'none';
        return;
    }

    // Pagination Logic
    const totalItems = data.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    
    if (CURRENT_PAGE > totalPages) CURRENT_PAGE = 1;
    
    const startIndex = (CURRENT_PAGE - 1) * ITEMS_PER_PAGE;
    const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);
    const pageData = data.slice(startIndex, endIndex);

    // Update Controls
    controls.style.display = totalItems > 0 ? 'flex' : 'none';
    info.textContent = `Showing ${startIndex + 1} to ${endIndex} of ${totalItems} results`;
    prevBtn.disabled = CURRENT_PAGE === 1;
    nextBtn.disabled = CURRENT_PAGE >= totalPages;

    // Button Events
    prevBtn.onclick = () => { if(CURRENT_PAGE > 1) { CURRENT_PAGE--; renderInventoryTable(data); } };
    nextBtn.onclick = () => { if(CURRENT_PAGE < totalPages) { CURRENT_PAGE++; renderInventoryTable(data); } };

    let html = '<table><thead><tr><th>Product Name</th><th>Status</th><th>Stock</th><th>Price</th><th>Value</th><th>Location</th><th>Supplier</th><th>Action</th></tr></thead><tbody>';
    const sorted = [...pageData].sort((a,b) => (a.product_name || '').localeCompare(b.product_name || ''));

    sorted.forEach(item => {
        let badgeClass = 'badge-success';
        let statusText = 'In Stock';
        
        // Status Logic
        const stock = Number(item.stock_level) || 0;
        const reorder = Number(item.reorder_level) || 0;
        
        if (item.status === 'On Order') { badgeClass = 'badge-info'; statusText = 'On Order'; }
        else if (stock === 0) { badgeClass = 'badge-danger'; statusText = 'Out of Stock'; }
        else if (stock <= reorder) { badgeClass = 'badge-warning'; statusText = 'Low Stock'; }
        
        const price = typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0;
        const totalVal = stock * price;
        const displayId = item.id;
        
        // IMPORTANT: Pass ID appropriately based on type (string or number)
        let idParam;
        if (typeof item.id === 'string') {
            idParam = `'${item.id}'`;
        } else if (typeof item.id === 'number') {
            idParam = item.id;
        } else {
            // Fallback for null/undefined IDs or weird types
            idParam = 'null'; 
        }

        html += `<tr>
            <td>
                <div style="font-weight:600;">${item.product_name}</div>
                <div style="font-size:0.75rem; color:var(--text-secondary); margin-top:2px;">ID: ${displayId}</div>
            </td>
            <td><span class="badge ${badgeClass}">${statusText}</span></td>
            <td>${stock} / ${reorder}</td>
            <td>₱${price.toFixed(2)}</td>
            <td>₱${totalVal.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}</td>
            <td>${item.location_name || '-'}</td>
            <td>${item.supplier_name || '-'}</td>
            <td>
                <div style="display:flex; gap:8px;">
                    <button onclick="window.openProductModal(${idParam})" class="btn btn-sm btn-outline">Edit</button>
                </div>
            </td>
        </tr>`;
    });
    html += '</tbody></table>';
    container.innerHTML = html;
}

// --- CRUD Operations ---

(window as any).refreshDashboard = () => { fetchDashboardData(true); };

(window as any).openProductModal = (id: string | null) => {
    const modal = document.getElementById('productModal');
    const title = document.getElementById('productModalTitle');
    const form = document.getElementById('productForm') as HTMLFormElement;
    if(!modal || !form) return;
    form.reset(); 
    
    const idInput = document.getElementById('editProductId') as HTMLInputElement;
    
    if (id) {
        // Loose equality check for string/number id mismatch
        const product = RAW_PRODUCT_LIST.find(p => p.id == id);
        if (product) {
            title!.textContent = 'Edit Product';
            idInput.value = product.id;
            
            (document.getElementById('pName') as HTMLInputElement).value = product.product_name || '';
            (document.getElementById('pStock') as HTMLInputElement).value = product.stock_level || 0;
            (document.getElementById('pReorder') as HTMLInputElement).value = product.reorder_level || 0;
            (document.getElementById('pPrice') as HTMLInputElement).value = product.price || 0;
            (document.getElementById('pRestockCount') as HTMLInputElement).value = product.restock_count || 0;
            (document.getElementById('pLocation') as HTMLInputElement).value = product.location_name || '';
            (document.getElementById('pSupplier') as HTMLInputElement).value = product.supplier_name || '';
            (document.getElementById('pDate') as HTMLInputElement).value = product.expected_delivery_date || '';
            (document.getElementById('pStatus') as HTMLInputElement).value = product.status || '';
        }
    } else { 
        title!.textContent = 'Add Product'; 
        idInput.value = '';
    }
    modal.classList.add('active');
};

(window as any).closeProductModal = () => {
    document.getElementById('productModal')?.classList.remove('active');
};

(window as any).handleSaveProduct = async (event: Event) => {
    event.preventDefault();
    
    const btn = (event.target as HTMLFormElement).querySelector('button[type="submit"]') as HTMLButtonElement;
    const originalBtnText = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Saving...';
    
    const idStr = (document.getElementById('editProductId') as HTMLInputElement).value;
    const name = (document.getElementById('pName') as HTMLInputElement).value;
    const stock = parseInt((document.getElementById('pStock') as HTMLInputElement).value) || 0;
    const reorder = parseInt((document.getElementById('pReorder') as HTMLInputElement).value) || 0;
    const price = parseFloat((document.getElementById('pPrice') as HTMLInputElement).value) || 0;
    const restock_count = parseInt((document.getElementById('pRestockCount') as HTMLInputElement).value) || 0;
    
    const location = (document.getElementById('pLocation') as HTMLInputElement).value || 'General Inventory';
    const supplier = (document.getElementById('pSupplier') as HTMLInputElement).value || 'Unknown Supplier';
    
    let date: string | null = (document.getElementById('pDate') as HTMLInputElement).value;
    if (date === '') date = null;
    let status = (document.getElementById('pStatus') as HTMLInputElement).value;
    if (status === '') status = null; 

    const payload: any = { 
        product_name: name, 
        stock_level: stock, 
        reorder_level: reorder, 
        price: price, 
        restock_count: restock_count, 
        location_name: location, 
        supplier_name: supplier, 
        expected_delivery_date: date, 
        status: status 
    };

    let error;
    try {
        if (idStr) { 
            const { error: err } = await supabase.from('inventory').update(payload).eq('id', idStr); 
            error = err; 
        } else { 
            const { error: err } = await supabase.from('inventory').insert([payload]); 
            error = err; 
        }
        
        if (error) { 
            console.error('Supabase CRUD Error:', error); 
             if (error.code === '42501' || error.message.includes('row-level security')) {
                showToast('SAVE Failed: Permission Denied', 'error');
            } else {
                showToast('Error saving: ' + error.message, 'error'); 
            }
        } else { 
            (window as any).closeProductModal(); 
            await fetchDashboardData(); 
            showToast(idStr ? 'Product updated' : 'Product added', 'success'); 
        }
    } catch (e: any) { 
        console.error('Unexpected error:', e); 
        showToast('System error: ' + e.message, 'error'); 
    } finally {
        btn.disabled = false;
        btn.textContent = originalBtnText;
    }
};

// --- Reports Logic ---
function convertToCSV(data: any[]) {
    if (!data || data.length === 0) return '';
    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(','), ...data.map(row => headers.map(fieldName => JSON.stringify(row[fieldName], (key, value) => value === null ? '' : value)).join(','))];
    return csvRows.join('\r\n');
}

function downloadCSV(csv: string, filename: string) {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', filename);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function initReports() {
    document.getElementById('btnExportInventory')?.addEventListener('click', () => { 
        if(!RAW_PRODUCT_LIST.length) return showToast('No data to export', 'error');
        downloadCSV(convertToCSV(RAW_PRODUCT_LIST), 'inventory_full.csv');
    });

    document.getElementById('btnExportLowStock')?.addEventListener('click', () => { 
        if(!CURRENT_DASHBOARD_DATA?.itemsToReorder.length) return showToast('No low stock items', 'info');
        downloadCSV(convertToCSV(CURRENT_DASHBOARD_DATA.itemsToReorder), 'low_stock_alert.csv');
    });

    document.getElementById('btnExportSuppliers')?.addEventListener('click', () => { 
        if(!CURRENT_DASHBOARD_DATA?.avgStockBySupplier.length) return showToast('No supplier data', 'info');
        downloadCSV(convertToCSV(CURRENT_DASHBOARD_DATA.avgStockBySupplier), 'supplier_performance.csv');
    });
}

// --- Navigation Logic ---
function setupNavigation() {
    const links = document.querySelectorAll('.nav-item');
    const sections = ['overviewSection', 'inventorySection', 'reportsSection'];
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-target');
            if(!targetId) return;

            // Update UI
            links.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            sections.forEach(secId => {
                const el = document.getElementById(secId);
                if(el) el.style.display = secId === targetId ? 'block' : 'none';
            });
        });
    });
}

// --- Main Execution ---
async function main() {
    const loader = document.getElementById('loader');
    const themeBtn = document.getElementById('themeBtn');
    let isLightMode = false;
    
    if (themeBtn) { 
        themeBtn.addEventListener('click', () => { 
            isLightMode = !isLightMode; 
            document.documentElement.setAttribute('data-theme', isLightMode ? 'light' : 'dark'); 
            updateChartsTheme(isLightMode); 
        }); 
    }

    const searchInput = document.getElementById('searchInput') as HTMLInputElement;
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = (e.target as HTMLInputElement).value.toLowerCase();
            const filteredProducts = RAW_PRODUCT_LIST.filter(p => (p.product_name && p.product_name.toLowerCase().includes(query)) || (p.location_name && p.location_name.toLowerCase().includes(query))); 
            
            // Reset to page 1 on search
            CURRENT_PAGE = 1;
            renderInventoryTable(filteredProducts);
            
            // If user searches, auto-switch to inventory tab to show results if not already there
            if(query.length > 0) {
                document.querySelector('.nav-item[data-target="inventorySection"]')?.dispatchEvent(new Event('click'));
            }
        });
    }

    setupNavigation();
    initReports();

    try {
        await fetchDashboardData();
        
        // --- REALTIME SUBSCRIPTION ---
        supabase.channel('inventory-channel')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'inventory' }, (payload: any) => { 
                console.log('Realtime Inventory Change:', payload); 
                fetchDashboardData(); 
                showToast('Dashboard synced', 'realtime'); 
            })
            .subscribe((status: any) => {
                if (status === 'SUBSCRIBED') { updateConnectionStatus('LIVE'); showToast('Connected', 'success'); }
                else if (status === 'CHANNEL_ERROR') { updateConnectionStatus('ERROR'); showToast('Connection Error', 'error'); }
                else if (status === 'TIMED_OUT') { updateConnectionStatus('RECONNECTING'); }
                else if (status === 'CLOSED') { updateConnectionStatus('OFFLINE'); }
            });
            
    } catch (err) { console.error(err); updateConnectionStatus('ERROR'); } finally { if(loader) loader.style.display = 'none'; }
}

document.addEventListener('DOMContentLoaded', main);