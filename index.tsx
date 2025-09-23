// --- Centralized Data ---
const dashboardData = {
    inventoryStatus: { 'In Stock': 70, 'Low Stock': 22, 'On Order': 8 },
    inventoryByLocation: [
        { location_name: 'Distribution Center (Cebu)', total_stock: 915 }, { location_name: 'Main Warehouse (Laguna)', total_stock: 889 },
        { location_name: 'Head Office (Quezon City)', total_stock: 747 }, { location_name: 'Branch (Legazpi City)', total_stock: 566 },
        { location_name: 'Retail Store (Manila)', total_stock: 460 }, { location_name: 'Satellite Office (Cagayan de Oro)', total_stock: 348 },
        { location_name: 'Outlet Store (Baguio)', total_stock: 293 }, { location_name: 'Regional Hub (Iloilo)', total_stock: 258 },
        { location_name: 'Service Center (Davao)', total_stock: 244 }, { location_name: 'Sales Office (Makati)', total_stock: 205 },
    ],
    topProducts: [
        { product_name: 'Lucky Me Pancit Canton Original', total_stock: 750 }, { product_name: 'Kojie San Kojic Acid Soap', total_stock: 350 },
        { product_name: 'Nestle Nescafe 3in1 Original 30s', total_stock: 300 }, { product_name: 'Uniqlo Heattech Crew Neck Long Sleeve', total_stock: 250 },
        { product_name: 'Great Taste White Coffee 3in1', total_stock: 230 }, { product_name: 'Penshoppe Graphic Tee Philippines', total_stock: 200 },
        { product_name: 'Silver Swan Soy Sauce 1L', total_stock: 195 }, { product_name: 'UFC Banana Catsup 320g', total_stock: 180 },
        { product_name: 'C2 Green Tea Apple 500ml', total_stock: 150 }, { product_name: 'Zara Slim Fit Jeans Dark Blue', total_stock: 140 },
    ],
    topSuppliers: [
        { supplier_name: 'Nike Philippines', total_orders: 4 }, { supplier_name: 'Adidas Philippines', total_orders: 3 },
        { supplier_name: 'Decathlon Philippines', total_orders: 2 }, { supplier_name: 'The Ordinary PH', total_orders: 2 },
        { supplier_name: 'Clean Home PH', total_orders: 2 },
    ],
    itemsToReorder: [
        { product_name: 'Xiaomi Redmi Note 12 Pro 5G', location_name: 'Retail Store (Manila)', stock_level: 10, reorder_level: 10 },
        { product_name: 'Realme GT Neo 5 240W', location_name: 'Service Center (Davao)', stock_level: 5, reorder_level: 5 }
    ],
    upcomingDeliveries: [
        { expected_delivery_date: '2025-09-20', items_expected: 7 }, { expected_delivery_date: '2025-09-21', items_expected: 4 },
        { expected_delivery_date: '2025-09-22', items_expected: 2 }, { expected_delivery_date: '2025-09-23', items_expected: 2 },
        { expected_delivery_date: '2025-09-24', items_expected: 2 }, { expected_delivery_date: '2025-09-25', items_expected: 3 },
        { expected_delivery_date: '2025-09-26', items_expected: 4 }, { expected_delivery_date: '2025-09-27', items_expected: 1 },
        { expected_delivery_date: '2025-09-28', items_expected: 3 }, { expected_delivery_date: '2025-09-29', items_expected: 2 },
    ],
    inventoryStatusByLocation: [
        { location_name: 'Branch (Legazpi City)', status: 'In Stock', item_count: 9 }, { location_name: 'Branch (Legazpi City)', status: 'Low Stock', item_count: 1 },
        { location_name: 'Branch (Legazpi City)', status: 'On Order', item_count: 1 }, { location_name: 'Distribution Center (Cebu)', status: 'In Stock', item_count: 10 },
        { location_name: 'Distribution Center (Cebu)', status: 'Low Stock', item_count: 1 }, { location_name: 'Distribution Center (Cebu)', status: 'On Order', item_count: 1 },
        { location_name: 'Head Office (Quezon City)', status: 'In Stock', item_count: 8 }, { location_name: 'Head Office (Quezon City)', status: 'Low Stock', item_count: 3 },
        { location_name: 'Main Warehouse (Laguna)', status: 'In Stock', item_count: 9 }, { location_name: 'Main Warehouse (Laguna)', status: 'Low Stock', item_count: 3 },
        { location_name: 'Main Warehouse (Laguna)', status: 'On Order', item_count: 1 }, { location_name: 'Outlet Store (Baguio)', status: 'In Stock', item_count: 7 },
        { location_name: 'Outlet Store (Baguio)', status: 'Low Stock', item_count: 1 }, { location_name: 'Outlet Store (Baguio)', status: 'On Order', item_count: 1 },
        { location_name: 'Regional Hub (Iloilo)', status: 'In Stock', item_count: 4 }, { location_name: 'Regional Hub (Iloilo)', status: 'Low Stock', item_count: 1 },
        { location_name: 'Regional Hub (Iloilo)', status: 'On Order', item_count: 1 }, { location_name: 'Retail Store (Manila)', status: 'In Stock', item_count: 5 },
        { location_name: 'Retail Store (Manila)', status: 'Low Stock', item_count: 7 }, { location_name: 'Retail Store (Manila)', status: 'On Order', item_count: 1 },
        { location_name: 'Sales Office (Makati)', status: 'In Stock', item_count: 5 }, { location_name: 'Sales Office (Makati)', status: 'Low Stock', item_count: 3 },
        { location_name: 'Satellite Office (Cagayan de Oro)', status: 'In Stock', item_count: 7 }, { location_name: 'Satellite Office (Cagayan de Oro)', status: 'Low Stock', item_count: 1 },
        { location_name: 'Service Center (Davao)', status: 'In Stock', item_count: 6 }, { location_name: 'Service Center (Davao)', status: 'Low Stock', item_count: 1 },
        { location_name: 'Service Center (Davao)', status: 'On Order', item_count: 2 },
    ],
    avgStockBySupplier: [
        { supplier_name: 'Monde Nissin Corp', average_stock: 375.0 }, { supplier_name: 'Beauty Solutions Inc.', average_stock: 175.0 },
        { supplier_name: 'Nestle Philippines', average_stock: 150.0 }, { supplier_name: 'Universal Robina Corp', average_stock: 126.67 },
        { supplier_name: 'Uniqlo PH', average_stock: 125.0 }, { supplier_name: 'Nutri-Asia Inc.', average_stock: 125.0 },
        { supplier_name: 'Penshoppe', average_stock: 100.0 }, { supplier_name: 'Century Pacific Food', average_stock: 100.0 },
        { supplier_name: 'Del Monte PH', average_stock: 90.0 }, { supplier_name: 'Mondelez Philippines', average_stock: 75.0 },
        { supplier_name: 'Belo Essentials', average_stock: 75.0 }, { supplier_name: 'Tech Innovators Ltd.', average_stock: 75.0 },
        { supplier_name: 'Zara Philippines', average_stock: 70.0 }, { supplier_name: 'Human Nature PH', average_stock: 60.0 },
        { supplier_name: 'San Miguel Brewery', average_stock: 60.0 }, { supplier_name: 'IKEA Philippines', average_stock: 60.0 },
        { supplier_name: 'PowerUp Electronics', average_stock: 60.0 }, { supplier_name: 'American Home Appliances', average_stock: 50.0 },
        { supplier_name: 'Neutrogena PH', average_stock: 50.0 }, { supplier_name: 'Hanabishi Home', average_stock: 45.0 },
        { supplier_name: 'Mobile Solutions Inc.', average_stock: 40.0 }, { supplier_name: 'Kitchen Essentials', average_stock: 40.0 },
        { supplier_name: 'P&G Philippines', average_stock: 40.0 }, { supplier_name: 'Audio Republic', average_stock: 40.0 },
        { supplier_name: 'Converse PH', average_stock: 35.0 }, { supplier_name: 'Galderma Philippines', average_stock: 32.5 },
        { supplier_name: 'CeraVe Philippines', average_stock: 30.0 }, { supplier_name: 'Maybelline PH', average_stock: 30.0 },
        { supplier_name: 'Gold\'s Gym Gear', average_stock: 30.0 }, { supplier_name: 'Laptop World', average_stock: 27.5 },
        { supplier_name: 'Tefal Home', average_stock: 27.5 }, { supplier_name: 'Apple Authorized Reseller', average_stock: 25.0 },
        { supplier_name: 'Kitchen Innovations', average_stock: 25.0 }, { supplier_name: 'Kyowa Kitchenware', average_stock: 25.0 },
        { supplier_name: 'Monitor Solutions', average_stock: 22.0 }, { supplier_name: 'Nike Philippines', average_stock: 21.6 },
        { supplier_name: 'Home Storage Solutions', average_stock: 20.0 }, { supplier_name: 'The Ordinary PH', average_stock: 20.0 },
        { supplier_name: 'L\'Oreal Philippines', average_stock: 20.0 }, { supplier_name: 'Logitech PH', average_stock: 18.0 },
        { supplier_name: 'Adidas Philippines', average_stock: 17.67 }, { supplier_name: 'PC Masters', average_stock: 17.5 },
        { supplier_name: 'Healthy Cooking Solutions', average_stock: 17.5 }, { supplier_name: 'The North Face PH', average_stock: 16.0 },
        { supplier_name: 'Home Comforts Inc.', average_stock: 15.0 }, { supplier_name: 'Filipino Fashion', average_stock: 15.0 },
        { supplier_name: 'Fitness First PH', average_stock: 15.0 }, { supplier_name: 'Imarflex Philippines', average_stock: 12.5 },
        { supplier_name: 'Sports Gear PH', average_stock: 12.5 }, { supplier_name: 'Sound Systems Co.', average_stock: 12.0 },
        { supplier_name: 'Global Gadgets Co.', average_stock: 10.0 }, { supplier_name: 'Lacoste Store', average_stock: 10.0 },
        { supplier_name: 'Appliance Pros', average_stock: 10.0 }, { supplier_name: 'Clean Home PH', average_stock: 10.0 },
        { supplier_name: 'Fitbit Philippines', average_stock: 8.5 }, { supplier_name: 'Lenovo Store', average_stock: 8.0 },
        { supplier_name: 'Garmin PH', average_stock: 8.0 }, { supplier_name: 'Gadget Hub PH', average_stock: 7.5 },
        { supplier_name: 'Gaming Gadgets', average_stock: 6.0 }, { supplier_name: 'Condura Cooling', average_stock: 5.0 },
        { supplier_name: 'Laundry Appliances PH', average_stock: 4.0 }, { supplier_name: 'Decathlon Philippines', average_stock: 4.0 },
    ],
    itemsWithoutDelivery: [
        { location_name: 'Distribution Center (Cebu)', items_with_null_delivery_date: 10 }, { location_name: 'Branch (Legazpi City)', items_with_null_delivery_date: 9 },
        { location_name: 'Main Warehouse (Laguna)', items_with_null_delivery_date: 9 }, { location_name: 'Head Office (Quezon City)', items_with_null_delivery_date: 8 },
        { location_name: 'Outlet Store (Baguio)', items_with_null_delivery_date: 7 }, { location_name: 'Satellite Office (Cagayan de Oro)', items_with_null_delivery_date: 7 },
        { location_name: 'Service Center (Davao)', items_with_null_delivery_date: 6 }, { location_name: 'Retail Store (Manila)', items_with_null_delivery_date: 5 },
        { location_name: 'Sales Office (Makati)', items_with_null_delivery_date: 5 }, { location_name: 'Regional Hub (Iloilo)', items_with_null_delivery_date: 4 },
    ],
    restockFrequency: [
        { product_name: 'Philips Air Fryer XXL 7.3L', restock_count: 2 }, { product_name: 'The Ordinary Niacinamide 10%', restock_count: 2 },
        { product_name: 'Cetaphil Gentle Skin Cleanser 591ml', restock_count: 2 }, { product_name: 'Nintendo Switch OLED Model', restock_count: 2 },
        { product_name: 'Sony WH-1000XM5 Headphones', restock_count: 2 }, { product_name: 'Imarflex Induction Cooker 2000W', restock_count: 2 },
        { product_name: 'Zara Slim Fit Jeans Dark Blue', restock_count: 2 }, { product_name: 'Olay Regenerist Micro-Sculpting Cream', restock_count: 2 },
        { product_name: 'Great Taste White Coffee 3in1', restock_count: 2 }, { product_name: 'CeraVe Moisturizing Cream', restock_count: 2 },
        { product_name: 'Adidas Essentials 3-Stripes Hoodie', restock_count: 2 }, { product_name: 'Yonex Badminton Racket Arcsaber', restock_count: 2 },
        { product_name: 'Adidas FIFA World Cup Ball', restock_count: 2 }, { product_name: 'Nestle Nescafe 3in1 Original 30s', restock_count: 2 },
        { product_name: 'Samsung Galaxy A54 5G 128GB', restock_count: 2 }, { product_name: 'Dyson V15 Detect Cordless Vacuum', restock_count: 2 },
        { product_name: 'Silver Swan Soy Sauce 1L', restock_count: 2 }, { product_name: 'Fitbit Charge 5 Fitness Tracker', restock_count: 2 },
        { product_name: 'Kojie San Kojic Acid Soap', restock_count: 2 }, { product_name: 'Penshoppe Graphic Tee Philippines', restock_count: 2 },
        { product_name: 'Dell Inspiron 15 3000 Laptop', restock_count: 2 }, { product_name: 'Decathlon Camping Tent 3-Person', restock_count: 2 },
        { product_name: 'The North Face Duffel Bag', restock_count: 2 }, { product_name: 'Nike Basketball Official Size', restock_count: 2 },
        { product_name: 'Nike Dri-FIT Running Shorts', restock_count: 2 }, { product_name: 'Lucky Me Pancit Canton Original', restock_count: 2 },
        { product_name: 'Tefal Rice Cooker 1.8L Fuzzy Logic', restock_count: 2 }, { product_name: 'HP Pavilion Gaming Laptop', restock_count: 2 },
        { product_name: 'Realme GT Neo 5 240W', restock_count: 2 }, { product_name: 'Uniqlo Heattech Crew Neck Long Sleeve', restock_count: 2 },
        { product_name: 'Kolin Inverter Split Type Aircon 1.5HP', restock_count: 1 }, { product_name: 'Lacoste Polo Shirt Classic Fit', restock_count: 1 },
        { product_name: 'Maybelline Fit Me Foundation', restock_count: 1 }, { product_name: 'Neutrogena Ultra Sheer Sunblock', restock_count: 1 },
        { product_name: 'Garmin Forerunner 245 GPS Watch', restock_count: 1 }, { product_name: 'L\'Oreal Paris Revitalift Serum', restock_count: 1 },
        { product_name: 'LG 27-inch 4K UHD Monitor', restock_count: 1 }, { product_name: 'Human Nature Sunflower Beauty Oil', restock_count: 1 },
        { product_name: 'OPPO Find X5 Pro', restock_count: 1 }, { product_name: 'Argentina Corned Beef 175g', restock_count: 1 },
        { product_name: 'Gold\'s Gym Resistance Bands', restock_count: 1 }, { product_name: 'Logitech MX Master 3S Mouse', restock_count: 1 },
        { product_name: 'Rubbermaid Storage Container 50L', restock_count: 1 }, { product_name: 'Belo Intensive Whitening Face Wash', restock_count: 1 },
        { product_name: 'Lenovo IdeaPad Slim 3', restock_count: 1 }, { product_name: 'Hanabishi Blender with Grinder', restock_count: 1 },
        { product_name: 'Lock&Lock Food Storage Set', restock_count: 1 }, { product_name: 'Converse Chuck Taylor All Star', restock_count: 1 },
        { product_name: 'Anker PowerCore 26800mAh', restock_count: 1 }, { product_name: 'iPhone 14 128GB Space Gray', restock_count: 1 },
        { product_name: 'Nike Air Force 1 Low White', restock_count: 1 }, { product_name: 'Samsung Digital Inverter Microwave', restock_count: 1 },
        { product_name: 'Adidas Yoga Mat 6mm', restock_count: 1 }, { product_name: 'IKEA Lack Wall Shelf White', restock_count: 1 },
        { product_name: 'JBL Flip 6 Bluetooth Speaker', restock_count: 1 }, { product_name: 'UFC Banana Catsup 320g', restock_count: 1 },
        { product_name: 'Xiaomi Redmi Note 12 Pro 5G', restock_count: 1 }, { product_name: 'C2 Green Tea Apple 500ml', restock_count: 1 },
        { product_name: 'Kraft Eden Cheese 440g', restock_count: 1 }, { product_name: 'Sharp Inverter Refrigerator 2-Door', restock_count: 1 },
        { product_name: 'Del Monte Sweet Style Spaghetti Sauce', restock_count: 1 }, { product_name: 'Reebok Dumbbells 5kg Set', restock_count: 1 },
        { product_name: 'Panasonic Front Load Washing Machine', restock_count: 1 }, { product_name: 'San Miguel Beer Pale Pilsen 330ml', restock_count: 1 },
        { product_name: 'Local Brand Barong Tagalog Formal', restock_count: 1 }, { product_name: 'Adidas Ultraboost 22 Running Shoes', restock_count: 1 },
        { product_name: 'American Home Stand Fan 18-inch', restock_count: 1 }, { product_name: 'Kyowa Kitchen Scale Digital', restock_count: 1 },
        { product_name: 'Condura Chest Freezer 200L', restock_count: 1 }, { product_name: 'Apple AirPods Pro 2nd Gen', restock_count: 1 },
    ]
};
// --- Chart.js Setup ---
declare var Chart: any;
const chartInstances: { [key: string]: any } = {};

const STATUS_COLORS = {
    'In Stock': '#3ecf8e',
    'Low Stock': '#f0ad4e',
    'On Order': '#5bc0de'
};

const commonBarDatasetConfig = {
    borderRadius: 4,
    borderSkipped: false,
    barPercentage: 0.9,
    categoryPercentage: 0.9,
};

const commonChartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    animation: false,
    layout: {
        padding: 8
    },
    plugins: {
        tooltip: {
            enabled: true,
            backgroundColor: '#333333',
            titleColor: '#ffffff',
            bodyColor: '#a3a3a3',
            padding: 10,
            cornerRadius: 8,
            titleFont: { family: "'Inter', sans-serif", weight: '600' },
            bodyFont: { family: "'Inter', sans-serif" }
        },
        legend: {
            position: 'top' as const,
            labels: {
                color: '#a3a3a3',
                font: {
                    family: "'Inter', sans-serif",
                },
                padding: 8,
                boxWidth: 12,
                usePointStyle: true,
            }
        }
    },
    scales: {
        y: {
            beginAtZero: true,
            grid: { color: 'rgba(255, 255, 255, 0.1)' },
            ticks: { 
                color: '#a3a3a3',
                padding: 8,
                font: { size: 11 }
            }
        },
        x: {
            grid: { color: 'rgba(255, 255, 255, 0.1)' },
            ticks: { 
                color: '#a3a3a3',
                autoSkip: true,
                maxRotation: 0,
                minRotation: 0,
                font: { size: 11 },
                padding: 8,
            }
        }
    }
};

function renderChart(canvasId: string, config: any) {
    const ctx = (document.getElementById(canvasId) as HTMLCanvasElement)?.getContext('2d');
    if (!ctx) return;
    
    if (chartInstances[canvasId]) {
        chartInstances[canvasId].destroy();
    }
    
    try {
      chartInstances[canvasId] = new Chart(ctx, config);
    } catch(err) {
      console.error(`Failed to render chart ${canvasId}:`, err);
      const canvas = document.getElementById(canvasId);
      const container = canvas?.parentElement;
      if (container) {
          container.innerHTML = `<div class="chart-error"><p>Could not load chart</p></div>`;
      }
    }
}

// --- Chart Rendering Functions ---
function truncateLabel(label: string, maxLength = 25): string {
    if (label.length > maxLength) {
        return label.substring(0, maxLength - 3) + '...';
    }
    return label;
}

function formatDateForAxis(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function renderInventoryStatusChart(data: { [key: string]: number }) {
    renderChart('inventoryStatusChart', {
        type: 'doughnut',
        data: {
            labels: Object.keys(data),
            datasets: [{
                label: 'Inventory Status',
                data: Object.values(data),
                backgroundColor: Object.keys(data).map(status => STATUS_COLORS[status as keyof typeof STATUS_COLORS]),
                borderColor: '#282828',
                borderWidth: 2,
            }]
        },
        options: { 
            ...commonChartOptions, 
            cutout: '60%',
            plugins: {
                ...commonChartOptions.plugins,
                legend: {
                    ...commonChartOptions.plugins.legend,
                    position: 'bottom' as const,
                }
            },
            scales: {}, // No scales for pie charts
        }
    });
}

function renderInventoryByLocationChart(data: any[]) {
    const fullLabels = data.map(i => i.location_name);
    const truncatedLabels = fullLabels.map(label => truncateLabel(label, 30));

    renderChart('inventoryByLocationChart', {
        type: 'bar',
        data: {
            labels: truncatedLabels,
            datasets: [{
                label: 'Total Stock',
                data: data.map(i => i.total_stock),
                backgroundColor: '#3ecf8e',
                ...commonBarDatasetConfig,
            }]
        },
        options: { 
            ...commonChartOptions, 
            indexAxis: 'y',
            plugins: {
                ...commonChartOptions.plugins,
                legend: {
                    display: false
                },
                tooltip: {
                    ...commonChartOptions.plugins.tooltip,
                    callbacks: {
                        title: (context: any) => fullLabels[context[0].dataIndex],
                    }
                }
            }
        }
    });
}

function renderTop10MostStockedChart(data: any[]) {
    // First, get the top 10 products
    const top10 = data.sort((a, b) => b.total_stock - a.total_stock).slice(0, 10);

    // Then, shuffle the array for random display order (Fisher-Yates shuffle)
    for (let i = top10.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [top10[i], top10[j]] = [top10[j], top10[i]];
    }

    const fullLabels = top10.map(p => p.product_name);
    const truncatedLabels = fullLabels.map(label => truncateLabel(label, 35));
    const stockValues = top10.map(p => p.total_stock);

    renderChart('top10MostStockedChart', {
        type: 'bar', // Base type for the combined chart
        data: {
            labels: truncatedLabels,
            datasets: [
                {
                    label: 'Stock Level (stick)',
                    data: stockValues,
                    backgroundColor: 'rgba(62, 207, 142, 0.3)',
                    borderColor: 'transparent',
                    barThickness: 3,
                    order: 2, // Render sticks behind dots
                },
                {
                    type: 'bubble', // Overlay for the lollipop dot
                    label: 'Stock Level',
                    data: stockValues.map((value, index) => ({
                        x: value,
                        y: index, // Matches the label index on the categorical y-axis
                        r: 6 // Radius of the dot
                    })),
                    backgroundColor: '#3ecf8e',
                    order: 1, // Render dots on top
                }
            ]
        },
        options: {
            ...commonChartOptions,
            indexAxis: 'y',
            scales: {
                ...commonChartOptions.scales,
                x: {
                    ...commonChartOptions.scales.x,
                    grid: {
                        color: 'transparent' // Hide vertical grid lines for a cleaner lollipop look
                    },
                    beginAtZero: true
                },
                y: {
                     ...commonChartOptions.scales.y,
                     grid: {
                        color: 'rgba(255, 255, 255, 0.1)' // Keep horizontal lines
                     },
                     ticks: {
                        ...commonChartOptions.scales.y.ticks,
                        padding: 10, // Add padding to labels
                     }
                }
            },
            plugins: {
                ...commonChartOptions.plugins,
                legend: {
                    display: false // Hide legend as it's redundant
                },
                tooltip: {
                    ...commonChartOptions.plugins.tooltip,
                    // Only show tooltips for the bubble dataset (the dot)
                    filter: (item: any) => item.datasetIndex === 1,
                    callbacks: {
                        title: (context: any) => fullLabels[context[0].dataIndex],
                        label: (context: any) => `Stock Level: ${context.raw.x.toLocaleString()}`
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
                label: 'Active Orders',
                data: data.map(s => s.total_orders),
                backgroundColor: '#3ecf8e',
                ...commonBarDatasetConfig,
            }]
        },
        options: { 
            ...commonChartOptions,
            plugins: {
                ...commonChartOptions.plugins,
                legend: {
                    display: false
                }
            }
        }
    });
}

function renderUpcomingDeliveriesChart(data: any[]) {
    const fullLabels = data.map(d => d.expected_delivery_date);
    const formattedLabels = data.map(d => formatDateForAxis(d.expected_delivery_date));

    renderChart('upcomingDeliveriesChart', {
        type: 'line',
        data: {
            labels: formattedLabels,
            datasets: [{
                label: 'Items Expected',
                data: data.map(d => d.items_expected),
                borderColor: '#3ecf8e',
                backgroundColor: 'rgba(62, 207, 142, 0.2)',
                fill: true,
                tension: 0.2,
                pointBackgroundColor: '#ffffff',
                pointBorderColor: '#3ecf8e',
                pointHoverRadius: 6,
                pointRadius: 3,
            }]
        },
        options: { 
            ...commonChartOptions,
            plugins: {
                ...commonChartOptions.plugins,
                tooltip: {
                    ...commonChartOptions.plugins.tooltip,
                    callbacks: {
                        title: (context: any) => fullLabels[context[0].dataIndex],
                    }
                }
            }
        }
    });
}

function renderItemsToReorderChart(data: any[]) {
    const fullLabels = data.map(i => i.product_name);
    const truncatedLabels = fullLabels.map(label => truncateLabel(label, 30));

    renderChart('itemsToReorderChart', {
        type: 'bar',
        data: {
            labels: truncatedLabels,
            datasets: [
                {
                    label: 'Current Stock',
                    data: data.map(i => i.stock_level),
                    backgroundColor: '#f0ad4e',
                    ...commonBarDatasetConfig,
                },
                {
                    label: 'Reorder Level',
                    data: data.map(i => i.reorder_level),
                    backgroundColor: '#d9534f',
                    ...commonBarDatasetConfig,
                }
            ]
        },
        options: { 
            ...commonChartOptions, 
            indexAxis: 'y',
            plugins: {
                ...commonChartOptions.plugins,
                tooltip: {
                    ...commonChartOptions.plugins.tooltip,
                    callbacks: {
                        title: (context: any) => fullLabels[context[0].dataIndex],
                    }
                }
            }
        }
    });
}


function renderInventoryStatusByLocationChart(data: any[]) {
    const locations = [...new Set(data.map(item => item.location_name))];
    const truncatedLocations = locations.map(l => truncateLabel(l, 15));
    const statuses = ['In Stock', 'Low Stock', 'On Order'];

    const datasets = statuses.map(status => ({
        label: status,
        data: locations.map(location => {
            const item = data.find(d => d.location_name === location && d.status === status);
            return item ? item.item_count : 0;
        }),
        backgroundColor: STATUS_COLORS[status as keyof typeof STATUS_COLORS],
        ...commonBarDatasetConfig,
    }));

    renderChart('inventoryStatusByLocationChart', {
        type: 'bar',
        data: { labels: truncatedLocations, datasets },
        options: {
            ...commonChartOptions,
            scales: {
                x: { ...commonChartOptions.scales.x, stacked: true },
                y: { ...commonChartOptions.scales.y, stacked: true }
            },
            plugins: {
                ...commonChartOptions.plugins,
                tooltip: {
                    ...commonChartOptions.plugins.tooltip,
                    callbacks: {
                        title: (context: any) => locations[context[0].dataIndex],
                    }
                }
            }
        }
    });
}


function renderAvgItemsBySupplierChart(data: any[]) {
     const top10 = data.slice(0, 10);
     const fullLabels = top10.map(s => s.supplier_name);
     const truncatedLabels = fullLabels.map(label => truncateLabel(label, 30));
     const stockValues = top10.map(s => s.average_stock);

    renderChart('avgItemsBySupplierChart', {
        type: 'bar',
        data: {
            labels: truncatedLabels,
            datasets: [
                {
                    label: 'Average Stock (stick)',
                    data: stockValues,
                    backgroundColor: 'rgba(62, 207, 142, 0.3)',
                    borderColor: 'transparent',
                    barThickness: 3,
                    order: 2,
                },
                {
                    type: 'bubble',
                    label: 'Average Stock',
                    data: stockValues.map((value, index) => ({
                        x: value,
                        y: index,
                        r: 6
                    })),
                    backgroundColor: '#3ecf8e',
                    order: 1,
                }
            ]
        },
        options: { 
            ...commonChartOptions, 
            indexAxis: 'y',
            scales: {
                ...commonChartOptions.scales,
                x: {
                    ...commonChartOptions.scales.x,
                    grid: { color: 'transparent' },
                    beginAtZero: true
                },
                y: {
                     ...commonChartOptions.scales.y,
                     grid: { color: 'rgba(255, 255, 255, 0.1)' },
                     ticks: {
                        ...commonChartOptions.scales.y.ticks,
                        padding: 10,
                     }
                }
            },
            plugins: {
                ...commonChartOptions.plugins,
                legend: {
                    display: false
                },
                tooltip: {
                    ...commonChartOptions.plugins.tooltip,
                    filter: (item: any) => item.datasetIndex === 1,
                    callbacks: {
                        title: (context: any) => fullLabels[context[0].dataIndex],
                        label: (context: any) => `Average Stock: ${context.raw.x.toLocaleString()}`
                    }
                }
            }
        }
    });
}

function renderRestockFrequencyTable(data: any[]) {
    const sortedData = data.sort((a,b) => b.restock_count - a.restock_count);
    createTable('restockFrequency', 
        ['Product Name', 'Restock Count'], 
        sortedData.map(i => [i.product_name, i.restock_count])
    );
}


function createTable(id: string, headers: string[], data: (string | number)[][]): void {
    const container = document.getElementById(id);
    if (!container) return;
    if (data.length === 0) {
        container.innerHTML = '<p style="text-align: center; padding: 20px;">No matching data found.</p>';
        return;
    }

    let table = '<table><thead><tr>';
    headers.forEach(header => table += `<th>${header}</th>`);
    table += '</tr></thead><tbody>';
    data.forEach(row => {
        table += '<tr>';
        row.forEach(cell => table += `<td>${cell !== null && cell !== undefined ? cell : 'N/A'}</td>`);
        table += '</tr>';
    });
    table += '</tbody></table>';
    container.innerHTML = table;
}

function renderItemsWithoutDeliveryChart(data: any[]) {
    // Sort data from highest to lowest for a clear ranking
    const sortedData = [...data].sort((a, b) => b.items_with_null_delivery_date - a.items_with_null_delivery_date);

    const fullLabels = sortedData.map(i => i.location_name);
    const truncatedLabels = fullLabels.map(label => truncateLabel(label, 30));
    const chartData = sortedData.map(i => i.items_with_null_delivery_date);

    renderChart('itemsWithoutDeliveryChart', {
        type: 'bar',
        data: {
            labels: truncatedLabels,
            datasets: [{
                label: 'Items w/o Delivery Date',
                data: chartData,
                backgroundColor: '#3ecf8e',
                ...commonBarDatasetConfig,
            }]
        },
        options: { 
            ...commonChartOptions, 
            indexAxis: 'y', // Make the bar chart horizontal
            plugins: {
                ...commonChartOptions.plugins,
                legend: {
                    display: false // Hide legend for single-dataset charts
                },
                tooltip: {
                    ...commonChartOptions.plugins.tooltip,
                    callbacks: {
                        // Show the full, non-truncated location name in the tooltip
                        title: (context: any) => fullLabels[context[0].dataIndex],
                    }
                }
            }
        }
    });
}


// --- Main Dashboard Rendering ---
function renderDashboard(data: typeof dashboardData) {
    renderInventoryStatusChart(data.inventoryStatus);
    renderInventoryByLocationChart(data.inventoryByLocation);
    renderTop10MostStockedChart(data.topProducts);
    renderTop5SuppliersChart(data.topSuppliers);
    renderItemsToReorderChart(data.itemsToReorder);
    renderUpcomingDeliveriesChart(data.upcomingDeliveries);
    renderInventoryStatusByLocationChart(data.inventoryStatusByLocation);
    renderAvgItemsBySupplierChart(data.avgStockBySupplier);
    renderRestockFrequencyTable(data.restockFrequency);
    renderItemsWithoutDeliveryChart(data.itemsWithoutDelivery);
}

// --- Main Execution ---
async function main() {
    const loader = document.getElementById('loader');
    const dashboard = document.getElementById('dashboard');

    if (!loader || !dashboard) {
        console.error("Missing loader or dashboard element.");
        return;
    }

    // Make the dashboard visible before rendering charts so they can size correctly.
    dashboard.style.display = 'grid';

    try {
        renderDashboard(dashboardData);
    } catch (err) {
        loader.textContent = `Error loading dashboard: ${err instanceof Error ? err.message : String(err)}`;
    } finally {
        loader.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', main);