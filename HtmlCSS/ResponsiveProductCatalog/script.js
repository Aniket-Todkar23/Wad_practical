const products = [
    { image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&h=80&fit=crop", name: "Wireless Headphones", price: "7,999", desc: "Noise-cancelling over-ear headphones." },
    { image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=80&h=80&fit=crop", name: "Smartwatch", price: "12,999", desc: "Fitness tracking smartwatch." },
    { image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=80&h=80&fit=crop", name: "Gaming Mouse", price: "2,499", desc: "Ergonomic gaming mouse." },
    { image: "https://images.unsplash.com/photo-1516387938699-a93567ec168e?w=80&h=80&fit=crop", name: "Laptop Stand", price: "1,999", desc: "Adjustable aluminium stand." },
    { image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=80&h=80&fit=crop", name: "Mechanical Keyboard", price: "4,500", desc: "RGB mechanical keyboard." },
    { image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=80&h=80&fit=crop", name: "24-inch Monitor", price: "15,000", desc: "1080p IPS display." },
    { image: "https://images.unsplash.com/photo-1587826388902-8618eb0e311e?w=80&h=80&fit=crop", name: "HD Webcam", price: "3,200", desc: "1080p webcam with mic." },
    { image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=80&h=80&fit=crop", name: "USB Microphone", price: "5,000", desc: "Condenser mic for streaming." },
    { image: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=80&h=80&fit=crop", name: "Gaming Chair", price: "18,000", desc: "Comfortable ergonomic chair." },
    { image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=80&h=80&fit=crop", name: "Bluetooth Speaker", price: "2,999", desc: "Portable waterproof speaker." },
    { image: "https://images.unsplash.com/photo-1544186523-a178e244837a?w=80&h=80&fit=crop", name: "Wi-Fi Router", price: "3,500", desc: "Dual-band gigabit router." },
    { image: "https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=80&h=80&fit=crop", name: "1TB SSD", price: "8,000", desc: "NVMe solid state drive." },
];

const itemsPerPage = 10;
let currentPage = 1;

function displayTableList(items, wrapper, rows_per_page, page) {
    wrapper.innerHTML = "";
    page--; // JavaScript arrays are 0-indexed

    let start = rows_per_page * page;
    let end = start + rows_per_page;
    let paginatedItems = items.slice(start, end);

    for (let i = 0; i < paginatedItems.length; i++) {
        let item = paginatedItems[i];
        let row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="${item.image}" alt="${item.name}"></td>
            <td>${item.name}</td>
            <td>₹${item.price}</td>
            <td>${item.desc}</td>
        `;
        wrapper.appendChild(row);
    }
}

function setupPagination(items, wrapper, rows_per_page) {
    wrapper.innerHTML = "";
    let page_count = Math.ceil(items.length / rows_per_page);

    for (let i = 1; i <= page_count; i++) {
        let btn = paginationButton(i, items);
        wrapper.appendChild(btn);
    }
}

function paginationButton(page, items) {
    let button = document.createElement('button');
    button.innerText = page;

    if (currentPage == page) button.classList.add('active');

    button.addEventListener('click', function () {
        currentPage = page;
        displayTableList(items, document.getElementById('productBody'), itemsPerPage, currentPage);

        let current_btn = document.querySelector('.pagination button.active');
        if (current_btn) {
            current_btn.classList.remove('active');
        }

        button.classList.add('active');
    });

    return button;
}

// Initial render
let productBody = document.getElementById('productBody');
let paginationElement = document.getElementById('pagination');

displayTableList(products, productBody, itemsPerPage, currentPage);
setupPagination(products, paginationElement, itemsPerPage);