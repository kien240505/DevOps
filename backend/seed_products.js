const PRODUCTS_DATA = [
  {
    "id": 1,
    "name": "MacBook Pro 16 M3 Max",
    "category": "Laptop",
    "price": 2499,
    "oldPrice": 2699,
    "rating": 4.9,
    "stock": 15,
    "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80",
    "description": "Sức mạnh vượt trội cho chuyên gia sáng tạo với chip M3 Max 16-Core CPU, 40-Core GPU và màn hình Liquid Retina XDR sắc nét.",
    "specs": [
      "Apple M3 Max Chip",
      "36GB Unified Memory",
      "1TB SSD Storage",
      "16.2-inch XDR Display",
      "Up to 22h battery"
    ],
    "featured": 1,
    "comments": [
      {
        "id": 101,
        "author": "Nguyễn Văn An",
        "avatar": "https://i.pravatar.cc/150?img=11",
        "rating": 5,
        "content": "Sản phẩm mượt mà, màn hình XDR siêu đỉnh!",
        "created_at": "2026-10-29T06:28:29.772Z",
        "variantPurchased": "Xám Không Gian (Space Gray) - 512GB SSD / 16GB RAM",
        "isVerifiedPurchase": true,
        "adminReply": "Cảm ơn bạn đã lựa chọn TechNova Store!",
        "images": []
      }
    ],
    "brand": "Apple",
    "isHot": true,
    "isFlashSale": true,
    "soldCount": 153,
    "ratingCount": 43,
    "discountPercent": 7,
    "quickSpecs": [
      "Apple M3 Max Chip",
      "36GB Unified Memory",
      "1TB SSD Storage",
      "16.2-inch XDR"
    ],
    "variants": [
      {
        "sku": "STD-512GB",
        "color": "Xám Không Gian (Space Gray)",
        "storage": "512GB SSD / 16GB RAM",
        "price": 2499,
        "stock": 12
      },
      {
        "sku": "UPG-1TB",
        "color": "Bạc Ánh Kim (Silver)",
        "storage": "1TB SSD / 32GB RAM",
        "price": 2949,
        "stock": 8
      }
    ]
  },
  {
    "id": 2,
    "name": "iPhone 15 Pro Max Titanium",
    "category": "Smartphone",
    "price": 1199,
    "oldPrice": 1299,
    "rating": 4.8,
    "stock": 25,
    "image": "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80",
    "description": "Thiết kế vỏ Titanium hàng không nhẹ vượt trội, nút Action linh hoạt và cụm camera zoom quang học 5x sắc nét tuyệt đối.",
    "specs": [
      "Chip A17 Pro 3nm",
      "Camera chính 48MP",
      "Zoom quang 5x",
      "Titanium Grade 5",
      "USB-C 3.0"
    ],
    "featured": 1,
    "comments": [
      {
        "id": 204,
        "author": "Trần Quốc Huy",
        "avatar": "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&q=80",
        "rating": 4,
        "variantPurchased": "Titanium Tự Nhiên - 256GB",
        "isVerifiedPurchase": true,
        "content": "Dùng rất thích, pin trâu và thiết kế sang trọng. Trừ 1 sao nhẹ vì hộp hơi móp góc xíu lúc ship nhưng bên trong phụ kiện vẫn nguyên vẹn 100%.",
        "images": [],
        "adminReply": "Dạ TechNova đã ghi nhận phản ánh và sẽ làm việc lại với bên đối tác vận chuyển để đảm bảo vỏ hộp luôn hoàn hảo nhất tới tay bạn!",
        "created_at": "2026-10-28T09:45:00.000Z"
      },
      {
        "id": 205,
        "author": "Hoàng Minh Tuấn",
        "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80",
        "rating": 5,
        "variantPurchased": "Titanium Đen Huyền Bí - 512GB",
        "isVerifiedPurchase": true,
        "content": "Sản phẩm đóng gói cực kỳ cẩn thận, nguyên seal chính hãng 100%. Giao hàng siêu tốc trong 2H tại nội thành đúng như cam kết!",
        "images": [
          "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80"
        ],
        "adminReply": "TechNova chân thành cảm ơn bạn Hoàng Minh Tuấn đã luôn tin tưởng và ủng hộ cửa hàng. Chúc bạn có trải nghiệm công nghệ tuyệt vời!",
        "created_at": "2026-10-25T08:30:00.000Z"
      }
    ],
    "brand": "Apple",
    "isHot": true,
    "isFlashSale": true,
    "soldCount": 226,
    "ratingCount": 63,
    "discountPercent": 8,
    "quickSpecs": [
      "Chip A17 Pro 3nm",
      "Camera chính 48MP",
      "Zoom quang 5x",
      "Titanium Grade 5"
    ],
    "variants": [
      {
        "sku": "VAR-256",
        "color": "Titanium Tự Nhiên",
        "storage": "256GB",
        "price": 1199,
        "stock": 15
      },
      {
        "sku": "VAR-512",
        "color": "Titanium Đen Huyền Bí",
        "storage": "512GB",
        "price": 1379,
        "stock": 10
      },
      {
        "sku": "VAR-1TB",
        "color": "Xanh Titan Tối Thượng",
        "storage": "1TB",
        "price": 1559,
        "stock": 5
      }
    ]
  },
  {
    "id": 3,
    "name": "Sony WH-1000XM5 ANC",
    "category": "Audio",
    "price": 349,
    "oldPrice": 399,
    "rating": 4.7,
    "stock": 30,
    "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
    "description": "Tai nghe chống ồn chủ động hàng đầu thế giới với 8 micro kép, màng loa 30mm đặc biệt và thời lượng pin 30 giờ.",
    "specs": [
      "Industry-leading ANC",
      "Hi-Res Audio LDAC",
      "30-hour Battery",
      "Speak-to-Chat",
      "Multi-point Bluetooth"
    ],
    "featured": 1,
    "comments": [
      {
        "id": 206,
        "author": "Hoàng Minh Tuấn",
        "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80",
        "rating": 5,
        "variantPurchased": "Màu Tiêu Chuẩn - Phiên bản tiêu chuẩn",
        "isVerifiedPurchase": true,
        "content": "Sản phẩm đóng gói cực kỳ cẩn thận, nguyên seal chính hãng 100%. Giao hàng siêu tốc trong 2H tại nội thành đúng như cam kết!",
        "images": [
          "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80"
        ],
        "adminReply": "TechNova chân thành cảm ơn bạn Hoàng Minh Tuấn đã luôn tin tưởng và ủng hộ cửa hàng. Chúc bạn có trải nghiệm công nghệ tuyệt vời!",
        "created_at": "2026-10-25T08:30:00.000Z"
      },
      {
        "id": 207,
        "author": "Lê Phương Thảo",
        "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80",
        "rating": 5,
        "variantPurchased": "Special Edition Black - Bản Cao Cấp Full Phụ Kiện",
        "isVerifiedPurchase": true,
        "content": "Build máy hoàn thiện quá xuất sắc! Hiệu năng mượt mà, màn hình màu sắc cực chuẩn cho designer. Đáng từng xu bát gạo.",
        "images": [],
        "adminReply": "Dạ TechNova cảm ơn chị Thảo nhiều ạ! Nếu cần hỗ trợ kỹ thuật chị cứ nhắn hotline 24/7 của bên em nhé.",
        "created_at": "2026-10-27T14:15:00.000Z"
      }
    ],
    "brand": "Sony",
    "isHot": true,
    "isFlashSale": true,
    "soldCount": 299,
    "ratingCount": 84,
    "discountPercent": 13,
    "quickSpecs": [
      "Industry-leading ANC",
      "Hi-Res Audio LDAC",
      "30-hour Battery",
      "Speak-to-Chat"
    ],
    "variants": [
      {
        "sku": "DFT-STD",
        "color": "Màu Tiêu Chuẩn",
        "storage": "Phiên bản tiêu chuẩn",
        "price": 349,
        "stock": 15
      },
      {
        "sku": "DFT-PRO",
        "color": "Special Edition Black",
        "storage": "Bản Cao Cấp Full Phụ Kiện",
        "price": 391,
        "stock": 8
      }
    ]
  },
  {
    "id": 4,
    "name": "Dell UltraSharp 32 4K USB-C Hub Monitor",
    "category": "Monitor",
    "price": 799,
    "oldPrice": 899,
    "rating": 4.6,
    "stock": 12,
    "image": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80",
    "description": "Màn hình đồ họa chuẩn IPS Black 4K HDR400, độ phủ màu 100% sRGB & DCI-P3 98%, cổng sạc USB-C 90W tiện lợi.",
    "specs": [
      "32-inch 4K UHD",
      "IPS Black Technology",
      "DCI-P3 98%",
      "USB-C Hub 90W Power",
      "Ergonomic Stand"
    ],
    "featured": 0,
    "comments": [
      {
        "id": 208,
        "author": "Lê Phương Thảo",
        "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80",
        "rating": 5,
        "variantPurchased": "Màu Tiêu Chuẩn - Phiên bản tiêu chuẩn",
        "isVerifiedPurchase": true,
        "content": "Build máy hoàn thiện quá xuất sắc! Hiệu năng mượt mà, màn hình màu sắc cực chuẩn cho designer. Đáng từng xu bát gạo.",
        "images": [],
        "adminReply": "Dạ TechNova cảm ơn chị Thảo nhiều ạ! Nếu cần hỗ trợ kỹ thuật chị cứ nhắn hotline 24/7 của bên em nhé.",
        "created_at": "2026-10-27T14:15:00.000Z"
      },
      {
        "id": 209,
        "author": "Trần Quốc Huy",
        "avatar": "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&q=80",
        "rating": 4,
        "variantPurchased": "Special Edition Black - Bản Cao Cấp Full Phụ Kiện",
        "isVerifiedPurchase": true,
        "content": "Dùng rất thích, pin trâu và thiết kế sang trọng. Trừ 1 sao nhẹ vì hộp hơi móp góc xíu lúc ship nhưng bên trong phụ kiện vẫn nguyên vẹn 100%.",
        "images": [],
        "adminReply": "Dạ TechNova đã ghi nhận phản ánh và sẽ làm việc lại với bên đối tác vận chuyển để đảm bảo vỏ hộp luôn hoàn hảo nhất tới tay bạn!",
        "created_at": "2026-10-28T09:45:00.000Z"
      }
    ],
    "brand": "Dell",
    "isHot": false,
    "isFlashSale": false,
    "soldCount": 372,
    "ratingCount": 104,
    "discountPercent": 11,
    "quickSpecs": [
      "32-inch 4K UHD",
      "IPS Black",
      "DCI-P3 98%",
      "USB-C Hub 90W Power"
    ],
    "variants": [
      {
        "sku": "DFT-STD",
        "color": "Màu Tiêu Chuẩn",
        "storage": "Phiên bản tiêu chuẩn",
        "price": 799,
        "stock": 15
      },
      {
        "sku": "DFT-PRO",
        "color": "Special Edition Black",
        "storage": "Bản Cao Cấp Full Phụ Kiện",
        "price": 895,
        "stock": 8
      }
    ]
  },
  {
    "id": 5,
    "name": "Logitech MX Master 3S Wireless Mouse",
    "category": "Accessory",
    "price": 99,
    "oldPrice": 119,
    "rating": 4.9,
    "stock": 50,
    "image": "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80",
    "description": "Chuột không dây công xưởng công nghệ với cảm biến 8K DPI Quiet Clicks và con cuộn siêu tốc MagSpeed.",
    "specs": [
      "8000 DPI Optical",
      "Quiet Click buttons",
      "MagSpeed Scroll",
      "Bluetooth & Logi Bolt",
      "USB-C Quick Charge"
    ],
    "featured": 1,
    "comments": [
      {
        "id": 210,
        "author": "Trần Quốc Huy",
        "avatar": "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&q=80",
        "rating": 4,
        "variantPurchased": "Màu Tiêu Chuẩn - Phiên bản tiêu chuẩn",
        "isVerifiedPurchase": true,
        "content": "Dùng rất thích, pin trâu và thiết kế sang trọng. Trừ 1 sao nhẹ vì hộp hơi móp góc xíu lúc ship nhưng bên trong phụ kiện vẫn nguyên vẹn 100%.",
        "images": [],
        "adminReply": "Dạ TechNova đã ghi nhận phản ánh và sẽ làm việc lại với bên đối tác vận chuyển để đảm bảo vỏ hộp luôn hoàn hảo nhất tới tay bạn!",
        "created_at": "2026-10-28T09:45:00.000Z"
      },
      {
        "id": 211,
        "author": "Hoàng Minh Tuấn",
        "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80",
        "rating": 5,
        "variantPurchased": "Special Edition Black - Bản Cao Cấp Full Phụ Kiện",
        "isVerifiedPurchase": true,
        "content": "Sản phẩm đóng gói cực kỳ cẩn thận, nguyên seal chính hãng 100%. Giao hàng siêu tốc trong 2H tại nội thành đúng như cam kết!",
        "images": [
          "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80"
        ],
        "adminReply": "TechNova chân thành cảm ơn bạn Hoàng Minh Tuấn đã luôn tin tưởng và ủng hộ cửa hàng. Chúc bạn có trải nghiệm công nghệ tuyệt vời!",
        "created_at": "2026-10-25T08:30:00.000Z"
      }
    ],
    "brand": "Logitech",
    "isHot": true,
    "isFlashSale": true,
    "soldCount": 445,
    "ratingCount": 125,
    "discountPercent": 17,
    "quickSpecs": [
      "8000 DPI",
      "Quiet Click buttons",
      "MagSpeed Scroll",
      "Bluetooth & Logi Bolt"
    ],
    "variants": [
      {
        "sku": "DFT-STD",
        "color": "Màu Tiêu Chuẩn",
        "storage": "Phiên bản tiêu chuẩn",
        "price": 99,
        "stock": 15
      },
      {
        "sku": "DFT-PRO",
        "color": "Special Edition Black",
        "storage": "Bản Cao Cấp Full Phụ Kiện",
        "price": 111,
        "stock": 8
      }
    ]
  },
  {
    "id": 6,
    "name": "Keychron Q1 Max Wireless Mechanical Keyboard",
    "category": "Accessory",
    "price": 219,
    "oldPrice": 239,
    "rating": 4.8,
    "stock": 18,
    "image": "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80",
    "description": "Bàn phím cơ CNC Nhôm nguyên khối, Gasket Mount êm ái, hỗ trợ kết nối 2.4Ghz siêu tốc và tùy chỉnh VIA/QMK.",
    "specs": [
      "Full Aluminum Body",
      "2.4Ghz & Bluetooth 5.1",
      "Hot-swappable Switches",
      "South-facing RGB",
      "QMK/VIA Programmable"
    ],
    "featured": 0,
    "comments": [
      {
        "id": 212,
        "author": "Hoàng Minh Tuấn",
        "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80",
        "rating": 5,
        "variantPurchased": "Màu Tiêu Chuẩn - Phiên bản tiêu chuẩn",
        "isVerifiedPurchase": true,
        "content": "Sản phẩm đóng gói cực kỳ cẩn thận, nguyên seal chính hãng 100%. Giao hàng siêu tốc trong 2H tại nội thành đúng như cam kết!",
        "images": [
          "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80"
        ],
        "adminReply": "TechNova chân thành cảm ơn bạn Hoàng Minh Tuấn đã luôn tin tưởng và ủng hộ cửa hàng. Chúc bạn có trải nghiệm công nghệ tuyệt vời!",
        "created_at": "2026-10-25T08:30:00.000Z"
      },
      {
        "id": 213,
        "author": "Lê Phương Thảo",
        "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80",
        "rating": 5,
        "variantPurchased": "Special Edition Black - Bản Cao Cấp Full Phụ Kiện",
        "isVerifiedPurchase": true,
        "content": "Build máy hoàn thiện quá xuất sắc! Hiệu năng mượt mà, màn hình màu sắc cực chuẩn cho designer. Đáng từng xu bát gạo.",
        "images": [],
        "adminReply": "Dạ TechNova cảm ơn chị Thảo nhiều ạ! Nếu cần hỗ trợ kỹ thuật chị cứ nhắn hotline 24/7 của bên em nhé.",
        "created_at": "2026-10-27T14:15:00.000Z"
      }
    ],
    "brand": "Keychron",
    "isHot": false,
    "isFlashSale": false,
    "soldCount": 518,
    "ratingCount": 145,
    "discountPercent": 8,
    "quickSpecs": [
      "Full Aluminum Body",
      "2.4Ghz & Bluetooth 5.1",
      "Hot-swappable Switches",
      "South-facing RGB"
    ],
    "variants": [
      {
        "sku": "DFT-STD",
        "color": "Màu Tiêu Chuẩn",
        "storage": "Phiên bản tiêu chuẩn",
        "price": 219,
        "stock": 15
      },
      {
        "sku": "DFT-PRO",
        "color": "Special Edition Black",
        "storage": "Bản Cao Cấp Full Phụ Kiện",
        "price": 245,
        "stock": 8
      }
    ]
  },
  {
    "id": 7,
    "name": "iPad Pro 13 M4 Ultra-Thin",
    "category": "Tablet",
    "price": 1299,
    "oldPrice": 1399,
    "rating": 4.9,
    "stock": 20,
    "image": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80",
    "description": "Mỏng kinh ngạc chỉ 5.1mm với màn hình Tandem OLED Ultra Retina XDR siêu nét và sức mạnh đột phá từ chip M4.",
    "specs": [
      "Chip Apple M4",
      "Ultra Retina XDR OLED",
      "Thickness 5.1mm",
      "Apple Pencil Pro Support",
      "Thunderbolt 4 / USB 4"
    ],
    "featured": 1,
    "comments": [
      {
        "id": 214,
        "author": "Lê Phương Thảo",
        "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80",
        "rating": 5,
        "variantPurchased": "Titanium Tự Nhiên - 256GB",
        "isVerifiedPurchase": true,
        "content": "Build máy hoàn thiện quá xuất sắc! Hiệu năng mượt mà, màn hình màu sắc cực chuẩn cho designer. Đáng từng xu bát gạo.",
        "images": [],
        "adminReply": "Dạ TechNova cảm ơn chị Thảo nhiều ạ! Nếu cần hỗ trợ kỹ thuật chị cứ nhắn hotline 24/7 của bên em nhé.",
        "created_at": "2026-10-27T14:15:00.000Z"
      },
      {
        "id": 215,
        "author": "Trần Quốc Huy",
        "avatar": "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&q=80",
        "rating": 4,
        "variantPurchased": "Titanium Đen Huyền Bí - 512GB",
        "isVerifiedPurchase": true,
        "content": "Dùng rất thích, pin trâu và thiết kế sang trọng. Trừ 1 sao nhẹ vì hộp hơi móp góc xíu lúc ship nhưng bên trong phụ kiện vẫn nguyên vẹn 100%.",
        "images": [],
        "adminReply": "Dạ TechNova đã ghi nhận phản ánh và sẽ làm việc lại với bên đối tác vận chuyển để đảm bảo vỏ hộp luôn hoàn hảo nhất tới tay bạn!",
        "created_at": "2026-10-28T09:45:00.000Z"
      }
    ],
    "brand": "Apple",
    "isHot": true,
    "isFlashSale": true,
    "soldCount": 591,
    "ratingCount": 165,
    "discountPercent": 7,
    "quickSpecs": [
      "Chip Apple M4",
      "Ultra Retina XDR OLED",
      "Thickness 5.1mm",
      "Apple Pencil Pro Sup..."
    ],
    "variants": [
      {
        "sku": "VAR-256",
        "color": "Titanium Tự Nhiên",
        "storage": "256GB",
        "price": 1299,
        "stock": 15
      },
      {
        "sku": "VAR-512",
        "color": "Titanium Đen Huyền Bí",
        "storage": "512GB",
        "price": 1494,
        "stock": 10
      },
      {
        "sku": "VAR-1TB",
        "color": "Xanh Titan Tối Thượng",
        "storage": "1TB",
        "price": 1689,
        "stock": 5
      }
    ]
  },
  {
    "id": 8,
    "name": "Apple Watch Ultra 2 Titanium",
    "category": "Smartwatch",
    "price": 799,
    "oldPrice": 849,
    "rating": 4.8,
    "stock": 14,
    "image": "https://images.unsplash.com/photo-1510017803434-a899398421b3?w=800&q=80",
    "description": "Đồng hồ thể thao chuyên nghiệp với màn hình sáng nhất 3000 nits, định vị GPS kép chuẩn xác và đo độ sâu chống nước 100m.",
    "specs": [
      "S9 SiP Chip",
      "3000 nits OLED Display",
      "Precision Dual GPS",
      "100m Water Resistant",
      "36 Hours Battery"
    ],
    "featured": 0,
    "comments": [
      {
        "id": 216,
        "author": "Trần Quốc Huy",
        "avatar": "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&q=80",
        "rating": 4,
        "variantPurchased": "Màu Tiêu Chuẩn - Phiên bản tiêu chuẩn",
        "isVerifiedPurchase": true,
        "content": "Dùng rất thích, pin trâu và thiết kế sang trọng. Trừ 1 sao nhẹ vì hộp hơi móp góc xíu lúc ship nhưng bên trong phụ kiện vẫn nguyên vẹn 100%.",
        "images": [],
        "adminReply": "Dạ TechNova đã ghi nhận phản ánh và sẽ làm việc lại với bên đối tác vận chuyển để đảm bảo vỏ hộp luôn hoàn hảo nhất tới tay bạn!",
        "created_at": "2026-10-28T09:45:00.000Z"
      },
      {
        "id": 217,
        "author": "Hoàng Minh Tuấn",
        "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80",
        "rating": 5,
        "variantPurchased": "Special Edition Black - Bản Cao Cấp Full Phụ Kiện",
        "isVerifiedPurchase": true,
        "content": "Sản phẩm đóng gói cực kỳ cẩn thận, nguyên seal chính hãng 100%. Giao hàng siêu tốc trong 2H tại nội thành đúng như cam kết!",
        "images": [
          "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80"
        ],
        "adminReply": "TechNova chân thành cảm ơn bạn Hoàng Minh Tuấn đã luôn tin tưởng và ủng hộ cửa hàng. Chúc bạn có trải nghiệm công nghệ tuyệt vời!",
        "created_at": "2026-10-25T08:30:00.000Z"
      }
    ],
    "brand": "Apple",
    "isHot": false,
    "isFlashSale": false,
    "soldCount": 664,
    "ratingCount": 186,
    "discountPercent": 6,
    "quickSpecs": [
      "S9 SiP Chip",
      "3000 nits OLED",
      "Precision Dual GPS",
      "100m Water Resistant"
    ],
    "variants": [
      {
        "sku": "DFT-STD",
        "color": "Màu Tiêu Chuẩn",
        "storage": "Phiên bản tiêu chuẩn",
        "price": 799,
        "stock": 15
      },
      {
        "sku": "DFT-PRO",
        "color": "Special Edition Black",
        "storage": "Bản Cao Cấp Full Phụ Kiện",
        "price": 895,
        "stock": 8
      }
    ]
  },
  {
    "id": 9,
    "name": "Samsung Galaxy S24 Ultra 5G AI",
    "category": "Smartphone",
    "price": 1299,
    "oldPrice": 1399,
    "rating": 4.8,
    "stock": 18,
    "image": "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&q=80",
    "description": "Quyền năng Galaxy AI tích hợp, bút S-Pen thông minh, khung viền Titanium và camera 200MP bắt trọn khoảnh khắc đêm.",
    "specs": [
      "Snapdragon 8 Gen 3 for Galaxy",
      "Camera 200MP AI",
      "Bút S-Pen tích hợp",
      "Màn hình Dynamic AMOLED 2X 120Hz",
      "Khung Titanium"
    ],
    "featured": 1,
    "comments": [
      {
        "id": 218,
        "author": "Hoàng Minh Tuấn",
        "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80",
        "rating": 5,
        "variantPurchased": "Titanium Tự Nhiên - 256GB",
        "isVerifiedPurchase": true,
        "content": "Sản phẩm đóng gói cực kỳ cẩn thận, nguyên seal chính hãng 100%. Giao hàng siêu tốc trong 2H tại nội thành đúng như cam kết!",
        "images": [
          "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80"
        ],
        "adminReply": "TechNova chân thành cảm ơn bạn Hoàng Minh Tuấn đã luôn tin tưởng và ủng hộ cửa hàng. Chúc bạn có trải nghiệm công nghệ tuyệt vời!",
        "created_at": "2026-10-25T08:30:00.000Z"
      },
      {
        "id": 219,
        "author": "Lê Phương Thảo",
        "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80",
        "rating": 5,
        "variantPurchased": "Titanium Đen Huyền Bí - 512GB",
        "isVerifiedPurchase": true,
        "content": "Build máy hoàn thiện quá xuất sắc! Hiệu năng mượt mà, màn hình màu sắc cực chuẩn cho designer. Đáng từng xu bát gạo.",
        "images": [],
        "adminReply": "Dạ TechNova cảm ơn chị Thảo nhiều ạ! Nếu cần hỗ trợ kỹ thuật chị cứ nhắn hotline 24/7 của bên em nhé.",
        "created_at": "2026-10-27T14:15:00.000Z"
      }
    ],
    "brand": "Samsung",
    "isHot": true,
    "isFlashSale": true,
    "soldCount": 737,
    "ratingCount": 206,
    "discountPercent": 7,
    "quickSpecs": [
      "Snapdragon 8 Gen 3 f...",
      "Camera 200MP AI",
      "Bút S-Pen tích hợp",
      "Màn hình Dynamic AMO..."
    ],
    "variants": [
      {
        "sku": "VAR-256",
        "color": "Titanium Tự Nhiên",
        "storage": "256GB",
        "price": 1299,
        "stock": 15
      },
      {
        "sku": "VAR-512",
        "color": "Titanium Đen Huyền Bí",
        "storage": "512GB",
        "price": 1494,
        "stock": 10
      },
      {
        "sku": "VAR-1TB",
        "color": "Xanh Titan Tối Thượng",
        "storage": "1TB",
        "price": 1689,
        "stock": 5
      }
    ]
  },
  {
    "id": 10,
    "name": "Asus ROG Zephyrus G16 OLED Gaming Laptop",
    "category": "Laptop",
    "price": 1999,
    "oldPrice": 2199,
    "rating": 4.9,
    "stock": 8,
    "image": "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&q=80",
    "description": "Laptop gaming mỏng nhẹ cao cấp nhất trang bị màn hình ROG Nebula OLED 240Hz, card đồ họa RTX 4070 và chip Intel Core Ultra 9.",
    "specs": [
      "Intel Core Ultra 9 185H",
      "NVIDIA RTX 4070 8GB",
      "16-inch ROG Nebula OLED 2.5K 240Hz",
      "32GB LPDDR5X RAM",
      "Vỏ Nhôm CNC cao cấp"
    ],
    "featured": 1,
    "comments": [
      {
        "id": 220,
        "author": "Lê Phương Thảo",
        "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80",
        "rating": 5,
        "variantPurchased": "Xám Không Gian (Space Gray) - 512GB SSD / 16GB RAM",
        "isVerifiedPurchase": true,
        "content": "Build máy hoàn thiện quá xuất sắc! Hiệu năng mượt mà, màn hình màu sắc cực chuẩn cho designer. Đáng từng xu bát gạo.",
        "images": [],
        "adminReply": "Dạ TechNova cảm ơn chị Thảo nhiều ạ! Nếu cần hỗ trợ kỹ thuật chị cứ nhắn hotline 24/7 của bên em nhé.",
        "created_at": "2026-10-27T14:15:00.000Z"
      },
      {
        "id": 221,
        "author": "Trần Quốc Huy",
        "avatar": "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&q=80",
        "rating": 4,
        "variantPurchased": "Bạc Ánh Kim (Silver) - 1TB SSD / 32GB RAM",
        "isVerifiedPurchase": true,
        "content": "Dùng rất thích, pin trâu và thiết kế sang trọng. Trừ 1 sao nhẹ vì hộp hơi móp góc xíu lúc ship nhưng bên trong phụ kiện vẫn nguyên vẹn 100%.",
        "images": [],
        "adminReply": "Dạ TechNova đã ghi nhận phản ánh và sẽ làm việc lại với bên đối tác vận chuyển để đảm bảo vỏ hộp luôn hoàn hảo nhất tới tay bạn!",
        "created_at": "2026-10-28T09:45:00.000Z"
      }
    ],
    "brand": "Asus",
    "isHot": true,
    "isFlashSale": true,
    "soldCount": 810,
    "ratingCount": 227,
    "discountPercent": 9,
    "quickSpecs": [
      "Intel Core Ultra 9 1...",
      "NVIDIA RTX 4070 8GB",
      "16-inch ROG Nebula O...",
      "32GB LPDDR5X RAM"
    ],
    "variants": [
      {
        "sku": "STD-512GB",
        "color": "Xám Không Gian (Space Gray)",
        "storage": "512GB SSD / 16GB RAM",
        "price": 1999,
        "stock": 12
      },
      {
        "sku": "UPG-1TB",
        "color": "Bạc Ánh Kim (Silver)",
        "storage": "1TB SSD / 32GB RAM",
        "price": 2359,
        "stock": 8
      }
    ]
  },
  {
    "id": 11,
    "name": "Bose QuietComfort Ultra Headphones",
    "category": "Audio",
    "price": 429,
    "oldPrice": 479,
    "rating": 4.8,
    "stock": 22,
    "image": "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80",
    "description": "Âm thanh không gian đột phá Bose Immersive Audio, khả năng khử tiếng ồn đẳng cấp thế giới và đệm tai sang trọng êm ái.",
    "specs": [
      "Bose Immersive Audio",
      "CustomTune Technology",
      "24 Hours Battery",
      "WindBlock Mode",
      "Multipoint Bluetooth 5.3"
    ],
    "featured": 0,
    "comments": [
      {
        "id": 222,
        "author": "Trần Quốc Huy",
        "avatar": "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&q=80",
        "rating": 4,
        "variantPurchased": "Đen Carbon Huyền Bí - Bản Tiêu Chuẩn",
        "isVerifiedPurchase": true,
        "content": "Dùng rất thích, pin trâu và thiết kế sang trọng. Trừ 1 sao nhẹ vì hộp hơi móp góc xíu lúc ship nhưng bên trong phụ kiện vẫn nguyên vẹn 100%.",
        "images": [],
        "adminReply": "Dạ TechNova đã ghi nhận phản ánh và sẽ làm việc lại với bên đối tác vận chuyển để đảm bảo vỏ hộp luôn hoàn hảo nhất tới tay bạn!",
        "created_at": "2026-10-28T09:45:00.000Z"
      },
      {
        "id": 223,
        "author": "Hoàng Minh Tuấn",
        "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80",
        "rating": 5,
        "variantPurchased": "Trắng Platinum Tinh Tế - Bản Tiêu Chuẩn",
        "isVerifiedPurchase": true,
        "content": "Sản phẩm đóng gói cực kỳ cẩn thận, nguyên seal chính hãng 100%. Giao hàng siêu tốc trong 2H tại nội thành đúng như cam kết!",
        "images": [
          "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80"
        ],
        "adminReply": "TechNova chân thành cảm ơn bạn Hoàng Minh Tuấn đã luôn tin tưởng và ủng hộ cửa hàng. Chúc bạn có trải nghiệm công nghệ tuyệt vời!",
        "created_at": "2026-10-25T08:30:00.000Z"
      }
    ],
    "brand": "Bose",
    "isHot": false,
    "isFlashSale": false,
    "soldCount": 883,
    "ratingCount": 247,
    "discountPercent": 10,
    "quickSpecs": [
      "Bose Immersive Audio",
      "CustomTune",
      "24 Hours Battery",
      "WindBlock Mode"
    ],
    "variants": [
      {
        "sku": "AUD-BLK",
        "color": "Đen Carbon Huyền Bí",
        "storage": "Bản Tiêu Chuẩn",
        "price": 429,
        "stock": 20
      },
      {
        "sku": "AUD-WHT",
        "color": "Trắng Platinum Tinh Tế",
        "storage": "Bản Tiêu Chuẩn",
        "price": 429,
        "stock": 12
      }
    ]
  },
  {
    "id": 12,
    "name": "AirPods Max Space Gray",
    "category": "Audio",
    "price": 549,
    "oldPrice": 599,
    "rating": 4.7,
    "stock": 16,
    "image": "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80",
    "description": "Sự kết hợp hoàn hảo giữa âm thanh độ trung thực cao và tính năng chống ồn chủ động hàng đầu từ hệ sinh thái Apple.",
    "specs": [
      "Apple H1 Chip each ear",
      "Spatial Audio with Dynamic Head Tracking",
      "Computational Audio",
      "Smart Case included"
    ],
    "featured": 1,
    "comments": [
      {
        "id": 224,
        "author": "Hoàng Minh Tuấn",
        "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80",
        "rating": 5,
        "variantPurchased": "Đen Carbon Huyền Bí - Bản Tiêu Chuẩn",
        "isVerifiedPurchase": true,
        "content": "Sản phẩm đóng gói cực kỳ cẩn thận, nguyên seal chính hãng 100%. Giao hàng siêu tốc trong 2H tại nội thành đúng như cam kết!",
        "images": [
          "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80"
        ],
        "adminReply": "TechNova chân thành cảm ơn bạn Hoàng Minh Tuấn đã luôn tin tưởng và ủng hộ cửa hàng. Chúc bạn có trải nghiệm công nghệ tuyệt vời!",
        "created_at": "2026-10-25T08:30:00.000Z"
      },
      {
        "id": 225,
        "author": "Lê Phương Thảo",
        "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80",
        "rating": 5,
        "variantPurchased": "Trắng Platinum Tinh Tế - Bản Tiêu Chuẩn",
        "isVerifiedPurchase": true,
        "content": "Build máy hoàn thiện quá xuất sắc! Hiệu năng mượt mà, màn hình màu sắc cực chuẩn cho designer. Đáng từng xu bát gạo.",
        "images": [],
        "adminReply": "Dạ TechNova cảm ơn chị Thảo nhiều ạ! Nếu cần hỗ trợ kỹ thuật chị cứ nhắn hotline 24/7 của bên em nhé.",
        "created_at": "2026-10-27T14:15:00.000Z"
      }
    ],
    "brand": "Apple",
    "isHot": true,
    "isFlashSale": true,
    "soldCount": 956,
    "ratingCount": 268,
    "discountPercent": 8,
    "quickSpecs": [
      "Apple H1 Chip each ear",
      "Spatial Audio with D...",
      "Computational Audio",
      "Smart Case"
    ],
    "variants": [
      {
        "sku": "AUD-BLK",
        "color": "Đen Carbon Huyền Bí",
        "storage": "Bản Tiêu Chuẩn",
        "price": 549,
        "stock": 20
      },
      {
        "sku": "AUD-WHT",
        "color": "Trắng Platinum Tinh Tế",
        "storage": "Bản Tiêu Chuẩn",
        "price": 549,
        "stock": 12
      }
    ]
  },
  {
    "id": 13,
    "name": "Marshall Stanmore III Bluetooth Speaker",
    "category": "Audio",
    "price": 379,
    "oldPrice": 419,
    "rating": 4.9,
    "stock": 12,
    "image": "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&q=80",
    "description": "Thiết kế vintage huyền thoại với chất âm rộng mở, củ loa hướng ra ngoài và ống dẫn sóng nâng cấp cho âm trường sống động.",
    "specs": [
      "80W Total Output",
      "Bluetooth 5.2 & RCA/3.5mm",
      "Dynamic Loudness",
      "Brass Control Knobs",
      "Eco-friendly Build"
    ],
    "featured": 0,
    "comments": [
      {
        "id": 226,
        "author": "Lê Phương Thảo",
        "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80",
        "rating": 5,
        "variantPurchased": "Đen Carbon Huyền Bí - Bản Tiêu Chuẩn",
        "isVerifiedPurchase": true,
        "content": "Build máy hoàn thiện quá xuất sắc! Hiệu năng mượt mà, màn hình màu sắc cực chuẩn cho designer. Đáng từng xu bát gạo.",
        "images": [],
        "adminReply": "Dạ TechNova cảm ơn chị Thảo nhiều ạ! Nếu cần hỗ trợ kỹ thuật chị cứ nhắn hotline 24/7 của bên em nhé.",
        "created_at": "2026-10-27T14:15:00.000Z"
      },
      {
        "id": 227,
        "author": "Trần Quốc Huy",
        "avatar": "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&q=80",
        "rating": 4,
        "variantPurchased": "Trắng Platinum Tinh Tế - Bản Tiêu Chuẩn",
        "isVerifiedPurchase": true,
        "content": "Dùng rất thích, pin trâu và thiết kế sang trọng. Trừ 1 sao nhẹ vì hộp hơi móp góc xíu lúc ship nhưng bên trong phụ kiện vẫn nguyên vẹn 100%.",
        "images": [],
        "adminReply": "Dạ TechNova đã ghi nhận phản ánh và sẽ làm việc lại với bên đối tác vận chuyển để đảm bảo vỏ hộp luôn hoàn hảo nhất tới tay bạn!",
        "created_at": "2026-10-28T09:45:00.000Z"
      }
    ],
    "brand": "Marshall",
    "isHot": false,
    "isFlashSale": false,
    "soldCount": 1029,
    "ratingCount": 288,
    "discountPercent": 10,
    "quickSpecs": [
      "80W Total Output",
      "Bluetooth 5.2 & RCA/...",
      "Dynamic Loudness",
      "Brass Control Knobs"
    ],
    "variants": [
      {
        "sku": "AUD-BLK",
        "color": "Đen Carbon Huyền Bí",
        "storage": "Bản Tiêu Chuẩn",
        "price": 379,
        "stock": 20
      },
      {
        "sku": "AUD-WHT",
        "color": "Trắng Platinum Tinh Tế",
        "storage": "Bản Tiêu Chuẩn",
        "price": 379,
        "stock": 12
      }
    ]
  },
  {
    "id": 14,
    "name": "LG UltraGear 34 OLED Curved Gaming Monitor",
    "category": "Monitor",
    "price": 999,
    "oldPrice": 1199,
    "rating": 4.9,
    "stock": 7,
    "image": "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&q=80",
    "description": "Màn hình cong OLED 800R đắm chìm tuyệt đối, tần số quét 240Hz siêu mượt và thời gian phản hồi 0.03ms không bóng mờ.",
    "specs": [
      "34-inch WQHD OLED",
      "800R Extreme Curve",
      "240Hz Refresh Rate",
      "0.03ms GtG",
      "DCI-P3 98.5%"
    ],
    "featured": 1,
    "comments": [
      {
        "id": 228,
        "author": "Trần Quốc Huy",
        "avatar": "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&q=80",
        "rating": 4,
        "variantPurchased": "Màu Tiêu Chuẩn - Phiên bản tiêu chuẩn",
        "isVerifiedPurchase": true,
        "content": "Dùng rất thích, pin trâu và thiết kế sang trọng. Trừ 1 sao nhẹ vì hộp hơi móp góc xíu lúc ship nhưng bên trong phụ kiện vẫn nguyên vẹn 100%.",
        "images": [],
        "adminReply": "Dạ TechNova đã ghi nhận phản ánh và sẽ làm việc lại với bên đối tác vận chuyển để đảm bảo vỏ hộp luôn hoàn hảo nhất tới tay bạn!",
        "created_at": "2026-10-28T09:45:00.000Z"
      },
      {
        "id": 229,
        "author": "Hoàng Minh Tuấn",
        "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80",
        "rating": 5,
        "variantPurchased": "Special Edition Black - Bản Cao Cấp Full Phụ Kiện",
        "isVerifiedPurchase": true,
        "content": "Sản phẩm đóng gói cực kỳ cẩn thận, nguyên seal chính hãng 100%. Giao hàng siêu tốc trong 2H tại nội thành đúng như cam kết!",
        "images": [
          "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80"
        ],
        "adminReply": "TechNova chân thành cảm ơn bạn Hoàng Minh Tuấn đã luôn tin tưởng và ủng hộ cửa hàng. Chúc bạn có trải nghiệm công nghệ tuyệt vời!",
        "created_at": "2026-10-25T08:30:00.000Z"
      }
    ],
    "brand": "LG",
    "isHot": true,
    "isFlashSale": true,
    "soldCount": 152,
    "ratingCount": 43,
    "discountPercent": 17,
    "quickSpecs": [
      "34-inch WQHD OLED",
      "800R Extreme Curve",
      "240Hz Refresh Rate",
      "0.03ms GtG"
    ],
    "variants": [
      {
        "sku": "DFT-STD",
        "color": "Màu Tiêu Chuẩn",
        "storage": "Phiên bản tiêu chuẩn",
        "price": 999,
        "stock": 15
      },
      {
        "sku": "DFT-PRO",
        "color": "Special Edition Black",
        "storage": "Bản Cao Cấp Full Phụ Kiện",
        "price": 1119,
        "stock": 8
      }
    ]
  },
  {
    "id": 15,
    "name": "Samsung Odyssey Neo G9 49 Super Curved",
    "category": "Monitor",
    "price": 1799,
    "oldPrice": 1999,
    "rating": 4.8,
    "stock": 5,
    "image": "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80",
    "description": "Tuyệt phẩm màn hình siêu rộng 49 inch Dual QHD, tấm nền Quantum Mini-LED cùng độ sáng cực đại 2000 nits đỉnh cao.",
    "specs": [
      "49-inch Dual QHD (5120x1440)",
      "1000R Curvature",
      "Quantum Mini-LED",
      "240Hz & 1ms",
      "CoreSync Lighting"
    ],
    "featured": 1,
    "comments": [
      {
        "id": 230,
        "author": "Hoàng Minh Tuấn",
        "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80",
        "rating": 5,
        "variantPurchased": "Màu Tiêu Chuẩn - Phiên bản tiêu chuẩn",
        "isVerifiedPurchase": true,
        "content": "Sản phẩm đóng gói cực kỳ cẩn thận, nguyên seal chính hãng 100%. Giao hàng siêu tốc trong 2H tại nội thành đúng như cam kết!",
        "images": [
          "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80"
        ],
        "adminReply": "TechNova chân thành cảm ơn bạn Hoàng Minh Tuấn đã luôn tin tưởng và ủng hộ cửa hàng. Chúc bạn có trải nghiệm công nghệ tuyệt vời!",
        "created_at": "2026-10-25T08:30:00.000Z"
      },
      {
        "id": 231,
        "author": "Lê Phương Thảo",
        "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80",
        "rating": 5,
        "variantPurchased": "Special Edition Black - Bản Cao Cấp Full Phụ Kiện",
        "isVerifiedPurchase": true,
        "content": "Build máy hoàn thiện quá xuất sắc! Hiệu năng mượt mà, màn hình màu sắc cực chuẩn cho designer. Đáng từng xu bát gạo.",
        "images": [],
        "adminReply": "Dạ TechNova cảm ơn chị Thảo nhiều ạ! Nếu cần hỗ trợ kỹ thuật chị cứ nhắn hotline 24/7 của bên em nhé.",
        "created_at": "2026-10-27T14:15:00.000Z"
      }
    ],
    "brand": "Samsung",
    "isHot": true,
    "isFlashSale": true,
    "soldCount": 225,
    "ratingCount": 63,
    "discountPercent": 10,
    "quickSpecs": [
      "49-inch Dual QHD (51...",
      "1000R Curvature",
      "Quantum Mini-LED",
      "240Hz & 1ms"
    ],
    "variants": [
      {
        "sku": "DFT-STD",
        "color": "Màu Tiêu Chuẩn",
        "storage": "Phiên bản tiêu chuẩn",
        "price": 1799,
        "stock": 15
      },
      {
        "sku": "DFT-PRO",
        "color": "Special Edition Black",
        "storage": "Bản Cao Cấp Full Phụ Kiện",
        "price": 2015,
        "stock": 8
      }
    ]
  },
  {
    "id": 16,
    "name": "Google Pixel 9 Pro Fold",
    "category": "Smartphone",
    "price": 1799,
    "oldPrice": 1899,
    "rating": 4.7,
    "stock": 10,
    "image": "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80",
    "description": "Điện thoại màn hình gập mỏng nhất của Google với chip Tensor G4, trợ lý Gemini AI thông minh và camera Super Res Zoom 20x.",
    "specs": [
      "Chip Google Tensor G4",
      "Màn hình ngoài 6.3 inch OLED 120Hz",
      "Màn hình trong 8.0 inch Super Actua",
      "Gemini Advanced 1 Year"
    ],
    "featured": 0,
    "comments": [
      {
        "id": 232,
        "author": "Lê Phương Thảo",
        "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80",
        "rating": 5,
        "variantPurchased": "Màu Tiêu Chuẩn - Phiên bản tiêu chuẩn",
        "isVerifiedPurchase": true,
        "content": "Build máy hoàn thiện quá xuất sắc! Hiệu năng mượt mà, màn hình màu sắc cực chuẩn cho designer. Đáng từng xu bát gạo.",
        "images": [],
        "adminReply": "Dạ TechNova cảm ơn chị Thảo nhiều ạ! Nếu cần hỗ trợ kỹ thuật chị cứ nhắn hotline 24/7 của bên em nhé.",
        "created_at": "2026-10-27T14:15:00.000Z"
      },
      {
        "id": 233,
        "author": "Trần Quốc Huy",
        "avatar": "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&q=80",
        "rating": 4,
        "variantPurchased": "Special Edition Black - Bản Cao Cấp Full Phụ Kiện",
        "isVerifiedPurchase": true,
        "content": "Dùng rất thích, pin trâu và thiết kế sang trọng. Trừ 1 sao nhẹ vì hộp hơi móp góc xíu lúc ship nhưng bên trong phụ kiện vẫn nguyên vẹn 100%.",
        "images": [],
        "adminReply": "Dạ TechNova đã ghi nhận phản ánh và sẽ làm việc lại với bên đối tác vận chuyển để đảm bảo vỏ hộp luôn hoàn hảo nhất tới tay bạn!",
        "created_at": "2026-10-28T09:45:00.000Z"
      }
    ],
    "brand": "TechNova",
    "isHot": false,
    "isFlashSale": false,
    "soldCount": 298,
    "ratingCount": 83,
    "discountPercent": 5,
    "quickSpecs": [
      "Chip Google Tensor G4",
      "Màn hình ngoài 6.3 i...",
      "Màn hình trong 8.0 i...",
      "Gemini Advanced 1 Year"
    ],
    "variants": [
      {
        "sku": "DFT-STD",
        "color": "Màu Tiêu Chuẩn",
        "storage": "Phiên bản tiêu chuẩn",
        "price": 1799,
        "stock": 15
      },
      {
        "sku": "DFT-PRO",
        "color": "Special Edition Black",
        "storage": "Bản Cao Cấp Full Phụ Kiện",
        "price": 2015,
        "stock": 8
      }
    ]
  },
  {
    "id": 17,
    "name": "PlayStation 5 Pro 2TB Console",
    "category": "Gaming Gear",
    "price": 699,
    "oldPrice": 749,
    "rating": 4.9,
    "stock": 20,
    "image": "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&q=80",
    "description": "Cỗ máy chơi game mạnh mẽ nhất hiện nay với công nghệ nâng cấp hình ảnh PSSR AI, GPU nâng cấp 67% và Ray Tracing tiên tiến.",
    "specs": [
      "Custom AMD Zen 2 CPU",
      "Upgraded GPU with PSSR AI",
      "2TB NVMe SSD",
      "Wi-Fi 7 Ready",
      "DualSense Wireless Controller"
    ],
    "featured": 1,
    "comments": [
      {
        "id": 234,
        "author": "Trần Quốc Huy",
        "avatar": "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&q=80",
        "rating": 4,
        "variantPurchased": "Màu Tiêu Chuẩn - Phiên bản tiêu chuẩn",
        "isVerifiedPurchase": true,
        "content": "Dùng rất thích, pin trâu và thiết kế sang trọng. Trừ 1 sao nhẹ vì hộp hơi móp góc xíu lúc ship nhưng bên trong phụ kiện vẫn nguyên vẹn 100%.",
        "images": [],
        "adminReply": "Dạ TechNova đã ghi nhận phản ánh và sẽ làm việc lại với bên đối tác vận chuyển để đảm bảo vỏ hộp luôn hoàn hảo nhất tới tay bạn!",
        "created_at": "2026-10-28T09:45:00.000Z"
      },
      {
        "id": 235,
        "author": "Hoàng Minh Tuấn",
        "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80",
        "rating": 5,
        "variantPurchased": "Special Edition Black - Bản Cao Cấp Full Phụ Kiện",
        "isVerifiedPurchase": true,
        "content": "Sản phẩm đóng gói cực kỳ cẩn thận, nguyên seal chính hãng 100%. Giao hàng siêu tốc trong 2H tại nội thành đúng như cam kết!",
        "images": [
          "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80"
        ],
        "adminReply": "TechNova chân thành cảm ơn bạn Hoàng Minh Tuấn đã luôn tin tưởng và ủng hộ cửa hàng. Chúc bạn có trải nghiệm công nghệ tuyệt vời!",
        "created_at": "2026-10-25T08:30:00.000Z"
      }
    ],
    "brand": "Sony",
    "isHot": true,
    "isFlashSale": true,
    "soldCount": 371,
    "ratingCount": 104,
    "discountPercent": 7,
    "quickSpecs": [
      "Custom AMD Zen 2 CPU",
      "Upgraded GPU with PS...",
      "2TB NVMe SSD",
      "Wi-Fi 7 Ready"
    ],
    "variants": [
      {
        "sku": "DFT-STD",
        "color": "Màu Tiêu Chuẩn",
        "storage": "Phiên bản tiêu chuẩn",
        "price": 699,
        "stock": 15
      },
      {
        "sku": "DFT-PRO",
        "color": "Special Edition Black",
        "storage": "Bản Cao Cấp Full Phụ Kiện",
        "price": 783,
        "stock": 8
      }
    ]
  },
  {
    "id": 18,
    "name": "Xbox Series X 1TB Console",
    "category": "Gaming Gear",
    "price": 499,
    "oldPrice": 549,
    "rating": 4.8,
    "stock": 15,
    "image": "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=800&q=80",
    "description": "Trải nghiệm chơi game 4K 120FPS đích thực với kiến trúc Xbox Velocity Architecture, hỗ trợ thư viện hàng ngàn game Game Pass.",
    "specs": [
      "12 Teraflops RDNA 2 GPU",
      "1TB Custom NVMe SSD",
      "True 4K Gaming & 8K Ready",
      "Quick Resume Multiple Games"
    ],
    "featured": 0,
    "comments": [
      {
        "id": 236,
        "author": "Hoàng Minh Tuấn",
        "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80",
        "rating": 5,
        "variantPurchased": "Màu Tiêu Chuẩn - Phiên bản tiêu chuẩn",
        "isVerifiedPurchase": true,
        "content": "Sản phẩm đóng gói cực kỳ cẩn thận, nguyên seal chính hãng 100%. Giao hàng siêu tốc trong 2H tại nội thành đúng như cam kết!",
        "images": [
          "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80"
        ],
        "adminReply": "TechNova chân thành cảm ơn bạn Hoàng Minh Tuấn đã luôn tin tưởng và ủng hộ cửa hàng. Chúc bạn có trải nghiệm công nghệ tuyệt vời!",
        "created_at": "2026-10-25T08:30:00.000Z"
      },
      {
        "id": 237,
        "author": "Lê Phương Thảo",
        "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80",
        "rating": 5,
        "variantPurchased": "Special Edition Black - Bản Cao Cấp Full Phụ Kiện",
        "isVerifiedPurchase": true,
        "content": "Build máy hoàn thiện quá xuất sắc! Hiệu năng mượt mà, màn hình màu sắc cực chuẩn cho designer. Đáng từng xu bát gạo.",
        "images": [],
        "adminReply": "Dạ TechNova cảm ơn chị Thảo nhiều ạ! Nếu cần hỗ trợ kỹ thuật chị cứ nhắn hotline 24/7 của bên em nhé.",
        "created_at": "2026-10-27T14:15:00.000Z"
      }
    ],
    "brand": "TechNova",
    "isHot": false,
    "isFlashSale": false,
    "soldCount": 444,
    "ratingCount": 124,
    "discountPercent": 9,
    "quickSpecs": [
      "12 Teraflops RDNA 2 ...",
      "1TB Custom NVMe SSD",
      "True 4K Gaming & 8K ...",
      "Quick Resume Multipl..."
    ],
    "variants": [
      {
        "sku": "DFT-STD",
        "color": "Màu Tiêu Chuẩn",
        "storage": "Phiên bản tiêu chuẩn",
        "price": 499,
        "stock": 15
      },
      {
        "sku": "DFT-PRO",
        "color": "Special Edition Black",
        "storage": "Bản Cao Cấp Full Phụ Kiện",
        "price": 559,
        "stock": 8
      }
    ]
  },
  {
    "id": 19,
    "name": "Nintendo Switch OLED Model Mario Red",
    "category": "Gaming Gear",
    "price": 349,
    "oldPrice": 379,
    "rating": 4.8,
    "stock": 25,
    "image": "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=800&q=80",
    "description": "Màn hình OLED 7 inch rực rỡ sắc màu, chân đế rộng linh hoạt, loa nâng cấp và dock kết nối cổng LAN tiện ích.",
    "specs": [
      "7-inch OLED Screen",
      "64GB Internal Storage",
      "Enhanced Audio Speakers",
      "Wired LAN Port Dock",
      "Mario Red Edition"
    ],
    "featured": 0,
    "comments": [
      {
        "id": 238,
        "author": "Lê Phương Thảo",
        "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80",
        "rating": 5,
        "variantPurchased": "Màu Tiêu Chuẩn - Phiên bản tiêu chuẩn",
        "isVerifiedPurchase": true,
        "content": "Build máy hoàn thiện quá xuất sắc! Hiệu năng mượt mà, màn hình màu sắc cực chuẩn cho designer. Đáng từng xu bát gạo.",
        "images": [],
        "adminReply": "Dạ TechNova cảm ơn chị Thảo nhiều ạ! Nếu cần hỗ trợ kỹ thuật chị cứ nhắn hotline 24/7 của bên em nhé.",
        "created_at": "2026-10-27T14:15:00.000Z"
      },
      {
        "id": 239,
        "author": "Trần Quốc Huy",
        "avatar": "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&q=80",
        "rating": 4,
        "variantPurchased": "Special Edition Black - Bản Cao Cấp Full Phụ Kiện",
        "isVerifiedPurchase": true,
        "content": "Dùng rất thích, pin trâu và thiết kế sang trọng. Trừ 1 sao nhẹ vì hộp hơi móp góc xíu lúc ship nhưng bên trong phụ kiện vẫn nguyên vẹn 100%.",
        "images": [],
        "adminReply": "Dạ TechNova đã ghi nhận phản ánh và sẽ làm việc lại với bên đối tác vận chuyển để đảm bảo vỏ hộp luôn hoàn hảo nhất tới tay bạn!",
        "created_at": "2026-10-28T09:45:00.000Z"
      }
    ],
    "brand": "Nintendo",
    "isHot": false,
    "isFlashSale": true,
    "soldCount": 517,
    "ratingCount": 145,
    "discountPercent": 8,
    "quickSpecs": [
      "7-inch OLED Screen",
      "64GB Internal Storage",
      "Enhanced Audio Speak...",
      "Wired LAN Port Dock"
    ],
    "variants": [
      {
        "sku": "DFT-STD",
        "color": "Màu Tiêu Chuẩn",
        "storage": "Phiên bản tiêu chuẩn",
        "price": 349,
        "stock": 15
      },
      {
        "sku": "DFT-PRO",
        "color": "Special Edition Black",
        "storage": "Bản Cao Cấp Full Phụ Kiện",
        "price": 391,
        "stock": 8
      }
    ]
  },
  {
    "id": 20,
    "name": "Valve Steam Deck OLED 1TB Handheld PC",
    "category": "Gaming Gear",
    "price": 649,
    "oldPrice": 699,
    "rating": 4.9,
    "stock": 14,
    "image": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80",
    "description": "Mang thư viện game PC Steam đi khắp mọi nơi với màn hình HDR OLED 90Hz rực rỡ, pin lâu hơn 50% và Wi-Fi 6E siêu nhanh.",
    "specs": [
      "7.4-inch HDR OLED 90Hz",
      "Custom 6nm AMD APU",
      "1TB NVMe SSD",
      "50Whr Battery (3-12h)",
      "Wi-Fi 6E Fast Download"
    ],
    "featured": 1,
    "comments": [
      {
        "id": 240,
        "author": "Trần Quốc Huy",
        "avatar": "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&q=80",
        "rating": 4,
        "variantPurchased": "Màu Tiêu Chuẩn - Phiên bản tiêu chuẩn",
        "isVerifiedPurchase": true,
        "content": "Dùng rất thích, pin trâu và thiết kế sang trọng. Trừ 1 sao nhẹ vì hộp hơi móp góc xíu lúc ship nhưng bên trong phụ kiện vẫn nguyên vẹn 100%.",
        "images": [],
        "adminReply": "Dạ TechNova đã ghi nhận phản ánh và sẽ làm việc lại với bên đối tác vận chuyển để đảm bảo vỏ hộp luôn hoàn hảo nhất tới tay bạn!",
        "created_at": "2026-10-28T09:45:00.000Z"
      },
      {
        "id": 241,
        "author": "Hoàng Minh Tuấn",
        "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80",
        "rating": 5,
        "variantPurchased": "Special Edition Black - Bản Cao Cấp Full Phụ Kiện",
        "isVerifiedPurchase": true,
        "content": "Sản phẩm đóng gói cực kỳ cẩn thận, nguyên seal chính hãng 100%. Giao hàng siêu tốc trong 2H tại nội thành đúng như cam kết!",
        "images": [
          "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80"
        ],
        "adminReply": "TechNova chân thành cảm ơn bạn Hoàng Minh Tuấn đã luôn tin tưởng và ủng hộ cửa hàng. Chúc bạn có trải nghiệm công nghệ tuyệt vời!",
        "created_at": "2026-10-25T08:30:00.000Z"
      }
    ],
    "brand": "TechNova",
    "isHot": true,
    "isFlashSale": true,
    "soldCount": 590,
    "ratingCount": 165,
    "discountPercent": 7,
    "quickSpecs": [
      "7.4-inch HDR OLED 90Hz",
      "Custom 6nm AMD APU",
      "1TB NVMe SSD",
      "50Whr Battery (3-12h)"
    ],
    "variants": [
      {
        "sku": "DFT-STD",
        "color": "Màu Tiêu Chuẩn",
        "storage": "Phiên bản tiêu chuẩn",
        "price": 649,
        "stock": 15
      },
      {
        "sku": "DFT-PRO",
        "color": "Special Edition Black",
        "storage": "Bản Cao Cấp Full Phụ Kiện",
        "price": 727,
        "stock": 8
      }
    ]
  },
  {
    "id": 21,
    "name": "Garmin Fenix 7X Pro Sapphire Solar",
    "category": "Smartwatch",
    "price": 899,
    "oldPrice": 999,
    "rating": 4.9,
    "stock": 10,
    "image": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
    "description": "Đồng hồ GPS thể thao đa năng cao cấp nhất tích hợp thấu kính sạc năng lượng mặt trời, đèn pin LED siêu sáng và bản đồ địa hình toàn cầu.",
    "specs": [
      "Power Sapphire Solar Lens",
      "Built-in LED Flashlight",
      "Multi-band GPS SatIQ",
      "Up to 37 Days Battery Life",
      "Titanium Bezel"
    ],
    "featured": 1,
    "comments": [
      {
        "id": 242,
        "author": "Hoàng Minh Tuấn",
        "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80",
        "rating": 5,
        "variantPurchased": "Màu Tiêu Chuẩn - Phiên bản tiêu chuẩn",
        "isVerifiedPurchase": true,
        "content": "Sản phẩm đóng gói cực kỳ cẩn thận, nguyên seal chính hãng 100%. Giao hàng siêu tốc trong 2H tại nội thành đúng như cam kết!",
        "images": [
          "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80"
        ],
        "adminReply": "TechNova chân thành cảm ơn bạn Hoàng Minh Tuấn đã luôn tin tưởng và ủng hộ cửa hàng. Chúc bạn có trải nghiệm công nghệ tuyệt vời!",
        "created_at": "2026-10-25T08:30:00.000Z"
      },
      {
        "id": 243,
        "author": "Lê Phương Thảo",
        "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80",
        "rating": 5,
        "variantPurchased": "Special Edition Black - Bản Cao Cấp Full Phụ Kiện",
        "isVerifiedPurchase": true,
        "content": "Build máy hoàn thiện quá xuất sắc! Hiệu năng mượt mà, màn hình màu sắc cực chuẩn cho designer. Đáng từng xu bát gạo.",
        "images": [],
        "adminReply": "Dạ TechNova cảm ơn chị Thảo nhiều ạ! Nếu cần hỗ trợ kỹ thuật chị cứ nhắn hotline 24/7 của bên em nhé.",
        "created_at": "2026-10-27T14:15:00.000Z"
      }
    ],
    "brand": "TechNova",
    "isHot": true,
    "isFlashSale": true,
    "soldCount": 663,
    "ratingCount": 186,
    "discountPercent": 10,
    "quickSpecs": [
      "Power Sapphire Solar...",
      "Built-in LED Flashli...",
      "Multi-band GPS SatIQ",
      "Up to 37 Days Batter..."
    ],
    "variants": [
      {
        "sku": "DFT-STD",
        "color": "Màu Tiêu Chuẩn",
        "storage": "Phiên bản tiêu chuẩn",
        "price": 899,
        "stock": 15
      },
      {
        "sku": "DFT-PRO",
        "color": "Special Edition Black",
        "storage": "Bản Cao Cấp Full Phụ Kiện",
        "price": 1007,
        "stock": 8
      }
    ]
  },
  {
    "id": 22,
    "name": "Samsung Galaxy Watch 6 Classic",
    "category": "Smartwatch",
    "price": 399,
    "oldPrice": 449,
    "rating": 4.7,
    "stock": 18,
    "image": "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80",
    "description": "Sự trở lại của vòng xoay bezel xoay vật lý trứ danh, màn hình kính Sapphire siêu bền và cảm biến theo dõi sức khỏe BIA tân tiến.",
    "specs": [
      "Physical Rotating Bezel",
      "Sapphire Crystal Glass",
      "Body Composition Analysis",
      "Advanced Sleep Coaching",
      "Wear OS by Google"
    ],
    "featured": 0,
    "comments": [
      {
        "id": 244,
        "author": "Lê Phương Thảo",
        "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80",
        "rating": 5,
        "variantPurchased": "Titanium Tự Nhiên - 256GB",
        "isVerifiedPurchase": true,
        "content": "Build máy hoàn thiện quá xuất sắc! Hiệu năng mượt mà, màn hình màu sắc cực chuẩn cho designer. Đáng từng xu bát gạo.",
        "images": [],
        "adminReply": "Dạ TechNova cảm ơn chị Thảo nhiều ạ! Nếu cần hỗ trợ kỹ thuật chị cứ nhắn hotline 24/7 của bên em nhé.",
        "created_at": "2026-10-27T14:15:00.000Z"
      },
      {
        "id": 245,
        "author": "Trần Quốc Huy",
        "avatar": "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&q=80",
        "rating": 4,
        "variantPurchased": "Titanium Đen Huyền Bí - 512GB",
        "isVerifiedPurchase": true,
        "content": "Dùng rất thích, pin trâu và thiết kế sang trọng. Trừ 1 sao nhẹ vì hộp hơi móp góc xíu lúc ship nhưng bên trong phụ kiện vẫn nguyên vẹn 100%.",
        "images": [],
        "adminReply": "Dạ TechNova đã ghi nhận phản ánh và sẽ làm việc lại với bên đối tác vận chuyển để đảm bảo vỏ hộp luôn hoàn hảo nhất tới tay bạn!",
        "created_at": "2026-10-28T09:45:00.000Z"
      }
    ],
    "brand": "Samsung",
    "isHot": false,
    "isFlashSale": false,
    "soldCount": 736,
    "ratingCount": 206,
    "discountPercent": 11,
    "quickSpecs": [
      "Physical Rotating Be...",
      "Sapphire Crystal Glass",
      "Body Composition Ana...",
      "Advanced Sleep Coach..."
    ],
    "variants": [
      {
        "sku": "VAR-256",
        "color": "Titanium Tự Nhiên",
        "storage": "256GB",
        "price": 399,
        "stock": 15
      },
      {
        "sku": "VAR-512",
        "color": "Titanium Đen Huyền Bí",
        "storage": "512GB",
        "price": 459,
        "stock": 10
      },
      {
        "sku": "VAR-1TB",
        "color": "Xanh Titan Tối Thượng",
        "storage": "1TB",
        "price": 519,
        "stock": 5
      }
    ]
  },
  {
    "id": 23,
    "name": "Microsoft Surface Pro 11 Copilot+ PC",
    "category": "Tablet",
    "price": 1199,
    "oldPrice": 1299,
    "rating": 4.8,
    "stock": 12,
    "image": "https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=800&q=80",
    "description": "Sự kết hợp hoàn hảo giữa máy tính bảng và laptop mạnh mẽ trang bị chip Snapdragon X Elite và trí tuệ nhân tạo Copilot+ thông minh.",
    "specs": [
      "Snapdragon X Elite 12 Cores",
      "13-inch PixelSense OLED 120Hz",
      "45 TOPS NPU AI Power",
      "All-day Battery up to 14h"
    ],
    "featured": 0,
    "comments": [
      {
        "id": 246,
        "author": "Trần Quốc Huy",
        "avatar": "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&q=80",
        "rating": 4,
        "variantPurchased": "Màu Tiêu Chuẩn - Phiên bản tiêu chuẩn",
        "isVerifiedPurchase": true,
        "content": "Dùng rất thích, pin trâu và thiết kế sang trọng. Trừ 1 sao nhẹ vì hộp hơi móp góc xíu lúc ship nhưng bên trong phụ kiện vẫn nguyên vẹn 100%.",
        "images": [],
        "adminReply": "Dạ TechNova đã ghi nhận phản ánh và sẽ làm việc lại với bên đối tác vận chuyển để đảm bảo vỏ hộp luôn hoàn hảo nhất tới tay bạn!",
        "created_at": "2026-10-28T09:45:00.000Z"
      },
      {
        "id": 247,
        "author": "Hoàng Minh Tuấn",
        "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80",
        "rating": 5,
        "variantPurchased": "Special Edition Black - Bản Cao Cấp Full Phụ Kiện",
        "isVerifiedPurchase": true,
        "content": "Sản phẩm đóng gói cực kỳ cẩn thận, nguyên seal chính hãng 100%. Giao hàng siêu tốc trong 2H tại nội thành đúng như cam kết!",
        "images": [
          "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80"
        ],
        "adminReply": "TechNova chân thành cảm ơn bạn Hoàng Minh Tuấn đã luôn tin tưởng và ủng hộ cửa hàng. Chúc bạn có trải nghiệm công nghệ tuyệt vời!",
        "created_at": "2026-10-25T08:30:00.000Z"
      }
    ],
    "brand": "TechNova",
    "isHot": false,
    "isFlashSale": false,
    "soldCount": 809,
    "ratingCount": 227,
    "discountPercent": 8,
    "quickSpecs": [
      "Snapdragon X Elite 1...",
      "13-inch PixelSense O...",
      "45 TOPS NPU AI Power",
      "All-day Battery up t..."
    ],
    "variants": [
      {
        "sku": "DFT-STD",
        "color": "Màu Tiêu Chuẩn",
        "storage": "Phiên bản tiêu chuẩn",
        "price": 1199,
        "stock": 15
      },
      {
        "sku": "DFT-PRO",
        "color": "Special Edition Black",
        "storage": "Bản Cao Cấp Full Phụ Kiện",
        "price": 1343,
        "stock": 8
      }
    ]
  },
  {
    "id": 24,
    "name": "Samsung Galaxy Tab S9 Ultra AMOLED",
    "category": "Tablet",
    "price": 1199,
    "oldPrice": 1319,
    "rating": 4.9,
    "stock": 14,
    "image": "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&q=80",
    "description": "Màn hình Dynamic AMOLED 2X khổng lồ 14.6 inch, kháng nước bụi IP68 đầu tiên trên tablet cao cấp, kèm bút S-Pen không độ trễ.",
    "specs": [
      "14.6-inch Dynamic AMOLED 2X 120Hz",
      "Snapdragon 8 Gen 2 for Galaxy",
      "IP68 Water & Dust Resistance",
      "Quad Speakers by AKG"
    ],
    "featured": 1,
    "comments": [
      {
        "id": 248,
        "author": "Hoàng Minh Tuấn",
        "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80",
        "rating": 5,
        "variantPurchased": "Titanium Tự Nhiên - 256GB",
        "isVerifiedPurchase": true,
        "content": "Sản phẩm đóng gói cực kỳ cẩn thận, nguyên seal chính hãng 100%. Giao hàng siêu tốc trong 2H tại nội thành đúng như cam kết!",
        "images": [
          "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80"
        ],
        "adminReply": "TechNova chân thành cảm ơn bạn Hoàng Minh Tuấn đã luôn tin tưởng và ủng hộ cửa hàng. Chúc bạn có trải nghiệm công nghệ tuyệt vời!",
        "created_at": "2026-10-25T08:30:00.000Z"
      },
      {
        "id": 249,
        "author": "Lê Phương Thảo",
        "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80",
        "rating": 5,
        "variantPurchased": "Titanium Đen Huyền Bí - 512GB",
        "isVerifiedPurchase": true,
        "content": "Build máy hoàn thiện quá xuất sắc! Hiệu năng mượt mà, màn hình màu sắc cực chuẩn cho designer. Đáng từng xu bát gạo.",
        "images": [],
        "adminReply": "Dạ TechNova cảm ơn chị Thảo nhiều ạ! Nếu cần hỗ trợ kỹ thuật chị cứ nhắn hotline 24/7 của bên em nhé.",
        "created_at": "2026-10-27T14:15:00.000Z"
      }
    ],
    "brand": "Samsung",
    "isHot": true,
    "isFlashSale": true,
    "soldCount": 882,
    "ratingCount": 247,
    "discountPercent": 9,
    "quickSpecs": [
      "14.6-inch Dynamic AM...",
      "Snapdragon 8 Gen 2 f...",
      "IP68 Water & Dust Re...",
      "Quad Speakers by AKG"
    ],
    "variants": [
      {
        "sku": "VAR-256",
        "color": "Titanium Tự Nhiên",
        "storage": "256GB",
        "price": 1199,
        "stock": 15
      },
      {
        "sku": "VAR-512",
        "color": "Titanium Đen Huyền Bí",
        "storage": "512GB",
        "price": 1379,
        "stock": 10
      },
      {
        "sku": "VAR-1TB",
        "color": "Xanh Titan Tối Thượng",
        "storage": "1TB",
        "price": 1559,
        "stock": 5
      }
    ]
  },
  {
    "id": 25,
    "name": "Dell XPS 15 9530 OLED Creator Laptop",
    "category": "Laptop",
    "price": 2199,
    "oldPrice": 2399,
    "rating": 4.8,
    "stock": 9,
    "image": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80",
    "description": "Biểu tượng laptop đồ họa mỏng nhẹ với màn hình 3.5K OLED cảm ứng, viền siêu mỏng InfinityEdge 4 cạnh và cấu hình Intel Gen 13.",
    "specs": [
      "Intel Core i7-13700H",
      "NVIDIA RTX 4060 8GB",
      "15.6-inch 3.5K OLED Touch",
      "32GB DDR5 RAM",
      "CNC Aluminum & Carbon Fiber"
    ],
    "featured": 0,
    "comments": [
      {
        "id": 250,
        "author": "Lê Phương Thảo",
        "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80",
        "rating": 5,
        "variantPurchased": "Xám Không Gian (Space Gray) - 512GB SSD / 16GB RAM",
        "isVerifiedPurchase": true,
        "content": "Build máy hoàn thiện quá xuất sắc! Hiệu năng mượt mà, màn hình màu sắc cực chuẩn cho designer. Đáng từng xu bát gạo.",
        "images": [],
        "adminReply": "Dạ TechNova cảm ơn chị Thảo nhiều ạ! Nếu cần hỗ trợ kỹ thuật chị cứ nhắn hotline 24/7 của bên em nhé.",
        "created_at": "2026-10-27T14:15:00.000Z"
      },
      {
        "id": 251,
        "author": "Trần Quốc Huy",
        "avatar": "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&q=80",
        "rating": 4,
        "variantPurchased": "Bạc Ánh Kim (Silver) - 1TB SSD / 32GB RAM",
        "isVerifiedPurchase": true,
        "content": "Dùng rất thích, pin trâu và thiết kế sang trọng. Trừ 1 sao nhẹ vì hộp hơi móp góc xíu lúc ship nhưng bên trong phụ kiện vẫn nguyên vẹn 100%.",
        "images": [],
        "adminReply": "Dạ TechNova đã ghi nhận phản ánh và sẽ làm việc lại với bên đối tác vận chuyển để đảm bảo vỏ hộp luôn hoàn hảo nhất tới tay bạn!",
        "created_at": "2026-10-28T09:45:00.000Z"
      }
    ],
    "brand": "Dell",
    "isHot": false,
    "isFlashSale": false,
    "soldCount": 955,
    "ratingCount": 267,
    "discountPercent": 8,
    "quickSpecs": [
      "Intel Core i7-13700H",
      "NVIDIA RTX 4060 8GB",
      "15.6-inch 3.5K OLED ...",
      "32GB DDR5 RAM"
    ],
    "variants": [
      {
        "sku": "STD-512GB",
        "color": "Xám Không Gian (Space Gray)",
        "storage": "512GB SSD / 16GB RAM",
        "price": 2199,
        "stock": 12
      },
      {
        "sku": "UPG-1TB",
        "color": "Bạc Ánh Kim (Silver)",
        "storage": "1TB SSD / 32GB RAM",
        "price": 2595,
        "stock": 8
      }
    ]
  },
  {
    "id": 26,
    "name": "Lenovo ThinkPad X1 Carbon Gen 12",
    "category": "Laptop",
    "price": 1899,
    "oldPrice": 2099,
    "rating": 4.9,
    "stock": 11,
    "image": "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&q=80",
    "description": "Đỉnh cao doanh nhân siêu bền bỉ với trọng lượng nhẹ chỉ 1.09kg, bàn phím gõ êm nhất thế giới và chip Intel Core Ultra AI mới nhất.",
    "specs": [
      "Intel Core Ultra 7 155H",
      "14-inch 2.8K OLED 120Hz",
      "1.09kg Featherweight",
      "Military-grade MIL-STD 810H",
      "TrackPoint & Haptic Touchpad"
    ],
    "featured": 0,
    "comments": [
      {
        "id": 252,
        "author": "Trần Quốc Huy",
        "avatar": "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&q=80",
        "rating": 4,
        "variantPurchased": "Màu Tiêu Chuẩn - Phiên bản tiêu chuẩn",
        "isVerifiedPurchase": true,
        "content": "Dùng rất thích, pin trâu và thiết kế sang trọng. Trừ 1 sao nhẹ vì hộp hơi móp góc xíu lúc ship nhưng bên trong phụ kiện vẫn nguyên vẹn 100%.",
        "images": [],
        "adminReply": "Dạ TechNova đã ghi nhận phản ánh và sẽ làm việc lại với bên đối tác vận chuyển để đảm bảo vỏ hộp luôn hoàn hảo nhất tới tay bạn!",
        "created_at": "2026-10-28T09:45:00.000Z"
      },
      {
        "id": 253,
        "author": "Hoàng Minh Tuấn",
        "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80",
        "rating": 5,
        "variantPurchased": "Special Edition Black - Bản Cao Cấp Full Phụ Kiện",
        "isVerifiedPurchase": true,
        "content": "Sản phẩm đóng gói cực kỳ cẩn thận, nguyên seal chính hãng 100%. Giao hàng siêu tốc trong 2H tại nội thành đúng như cam kết!",
        "images": [
          "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80"
        ],
        "adminReply": "TechNova chân thành cảm ơn bạn Hoàng Minh Tuấn đã luôn tin tưởng và ủng hộ cửa hàng. Chúc bạn có trải nghiệm công nghệ tuyệt vời!",
        "created_at": "2026-10-25T08:30:00.000Z"
      }
    ],
    "brand": "TechNova",
    "isHot": false,
    "isFlashSale": false,
    "soldCount": 1028,
    "ratingCount": 288,
    "discountPercent": 10,
    "quickSpecs": [
      "Intel Core Ultra 7 1...",
      "14-inch 2.8K OLED 12...",
      "1.09kg Featherweight",
      "Military-grade MIL-S..."
    ],
    "variants": [
      {
        "sku": "DFT-STD",
        "color": "Màu Tiêu Chuẩn",
        "storage": "Phiên bản tiêu chuẩn",
        "price": 1899,
        "stock": 15
      },
      {
        "sku": "DFT-PRO",
        "color": "Special Edition Black",
        "storage": "Bản Cao Cấp Full Phụ Kiện",
        "price": 2127,
        "stock": 8
      }
    ]
  },
  {
    "id": 27,
    "name": "Anker Prime 27,650mAh Power Bank 250W",
    "category": "Accessory",
    "price": 179,
    "oldPrice": 199,
    "rating": 4.9,
    "stock": 35,
    "image": "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&q=80",
    "description": "Pin dự phòng công suất khủng 250W hỗ trợ sạc nhanh cùng lúc 2 laptop, màn hình màu kỹ thuật số hiển thị công suất thời gian thực.",
    "specs": [
      "27,650mAh Capacity",
      "250W Total Output",
      "140W Single Port Max",
      "Smart Digital Display",
      "App Connectivity via Bluetooth"
    ],
    "featured": 0,
    "comments": [
      {
        "id": 254,
        "author": "Hoàng Minh Tuấn",
        "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80",
        "rating": 5,
        "variantPurchased": "Màu Tiêu Chuẩn - Phiên bản tiêu chuẩn",
        "isVerifiedPurchase": true,
        "content": "Sản phẩm đóng gói cực kỳ cẩn thận, nguyên seal chính hãng 100%. Giao hàng siêu tốc trong 2H tại nội thành đúng như cam kết!",
        "images": [
          "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80"
        ],
        "adminReply": "TechNova chân thành cảm ơn bạn Hoàng Minh Tuấn đã luôn tin tưởng và ủng hộ cửa hàng. Chúc bạn có trải nghiệm công nghệ tuyệt vời!",
        "created_at": "2026-10-25T08:30:00.000Z"
      },
      {
        "id": 255,
        "author": "Lê Phương Thảo",
        "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80",
        "rating": 5,
        "variantPurchased": "Special Edition Black - Bản Cao Cấp Full Phụ Kiện",
        "isVerifiedPurchase": true,
        "content": "Build máy hoàn thiện quá xuất sắc! Hiệu năng mượt mà, màn hình màu sắc cực chuẩn cho designer. Đáng từng xu bát gạo.",
        "images": [],
        "adminReply": "Dạ TechNova cảm ơn chị Thảo nhiều ạ! Nếu cần hỗ trợ kỹ thuật chị cứ nhắn hotline 24/7 của bên em nhé.",
        "created_at": "2026-10-27T14:15:00.000Z"
      }
    ],
    "brand": "Anker",
    "isHot": false,
    "isFlashSale": false,
    "soldCount": 151,
    "ratingCount": 42,
    "discountPercent": 10,
    "quickSpecs": [
      "27,650mAh Capacity",
      "250W Total Output",
      "140W Single Port Max",
      "Smart Digital"
    ],
    "variants": [
      {
        "sku": "DFT-STD",
        "color": "Màu Tiêu Chuẩn",
        "storage": "Phiên bản tiêu chuẩn",
        "price": 179,
        "stock": 15
      },
      {
        "sku": "DFT-PRO",
        "color": "Special Edition Black",
        "storage": "Bản Cao Cấp Full Phụ Kiện",
        "price": 200,
        "stock": 8
      }
    ]
  },
  {
    "id": 28,
    "name": "Elgato Stream Deck MK.2 White Studio Controller",
    "category": "Accessory",
    "price": 149,
    "oldPrice": 169,
    "rating": 4.8,
    "stock": 22,
    "image": "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800&q=80",
    "description": "Bàn điều khiển studio chuyên nghiệp với 15 phím LCD tùy biến vô hạn, điều khiển âm thanh, ánh sáng và livestream chỉ với một chạm.",
    "specs": [
      "15 Customizable LCD Keys",
      "One-touch Actions & Macros",
      "Detachable Faceplate Design",
      "Direct OBS & Twitch Integration"
    ],
    "featured": 0,
    "comments": [
      {
        "id": 256,
        "author": "Lê Phương Thảo",
        "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80",
        "rating": 5,
        "variantPurchased": "Màu Tiêu Chuẩn - Phiên bản tiêu chuẩn",
        "isVerifiedPurchase": true,
        "content": "Build máy hoàn thiện quá xuất sắc! Hiệu năng mượt mà, màn hình màu sắc cực chuẩn cho designer. Đáng từng xu bát gạo.",
        "images": [],
        "adminReply": "Dạ TechNova cảm ơn chị Thảo nhiều ạ! Nếu cần hỗ trợ kỹ thuật chị cứ nhắn hotline 24/7 của bên em nhé.",
        "created_at": "2026-10-27T14:15:00.000Z"
      },
      {
        "id": 257,
        "author": "Trần Quốc Huy",
        "avatar": "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&q=80",
        "rating": 4,
        "variantPurchased": "Special Edition Black - Bản Cao Cấp Full Phụ Kiện",
        "isVerifiedPurchase": true,
        "content": "Dùng rất thích, pin trâu và thiết kế sang trọng. Trừ 1 sao nhẹ vì hộp hơi móp góc xíu lúc ship nhưng bên trong phụ kiện vẫn nguyên vẹn 100%.",
        "images": [],
        "adminReply": "Dạ TechNova đã ghi nhận phản ánh và sẽ làm việc lại với bên đối tác vận chuyển để đảm bảo vỏ hộp luôn hoàn hảo nhất tới tay bạn!",
        "created_at": "2026-10-28T09:45:00.000Z"
      }
    ],
    "brand": "Elgato",
    "isHot": false,
    "isFlashSale": false,
    "soldCount": 224,
    "ratingCount": 63,
    "discountPercent": 12,
    "quickSpecs": [
      "15 Customizable LCD ...",
      "One-touch Actions & ...",
      "Detachable Faceplate...",
      "Direct OBS & Twitch ..."
    ],
    "variants": [
      {
        "sku": "DFT-STD",
        "color": "Màu Tiêu Chuẩn",
        "storage": "Phiên bản tiêu chuẩn",
        "price": 149,
        "stock": 15
      },
      {
        "sku": "DFT-PRO",
        "color": "Special Edition Black",
        "storage": "Bản Cao Cấp Full Phụ Kiện",
        "price": 167,
        "stock": 8
      }
    ]
  },
  {
    "id": 29,
    "name": "Sony Alpha 7 IV Mirrorless Camera",
    "category": "Gaming Gear",
    "price": 2499,
    "oldPrice": 2699,
    "rating": 4.9,
    "stock": 8,
    "image": "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80",
    "description": "Máy ảnh chuẩn mực cho nhà sáng tạo nội dung với cảm biến Exmor R CMOS 33MP, quay phim 4K 60p 10-bit và lấy nét mắt thời gian thực AI.",
    "specs": [
      "33MP Full-Frame Exmor R Sensor",
      "BIONZ XR Image Processor",
      "4K 60p 10-Bit 4:2:2 Video",
      "Real-time Eye AF Human/Animal/Bird"
    ],
    "featured": 1,
    "comments": [
      {
        "id": 258,
        "author": "Trần Quốc Huy",
        "avatar": "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&q=80",
        "rating": 4,
        "variantPurchased": "Màu Tiêu Chuẩn - Phiên bản tiêu chuẩn",
        "isVerifiedPurchase": true,
        "content": "Dùng rất thích, pin trâu và thiết kế sang trọng. Trừ 1 sao nhẹ vì hộp hơi móp góc xíu lúc ship nhưng bên trong phụ kiện vẫn nguyên vẹn 100%.",
        "images": [],
        "adminReply": "Dạ TechNova đã ghi nhận phản ánh và sẽ làm việc lại với bên đối tác vận chuyển để đảm bảo vỏ hộp luôn hoàn hảo nhất tới tay bạn!",
        "created_at": "2026-10-28T09:45:00.000Z"
      },
      {
        "id": 259,
        "author": "Hoàng Minh Tuấn",
        "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80",
        "rating": 5,
        "variantPurchased": "Special Edition Black - Bản Cao Cấp Full Phụ Kiện",
        "isVerifiedPurchase": true,
        "content": "Sản phẩm đóng gói cực kỳ cẩn thận, nguyên seal chính hãng 100%. Giao hàng siêu tốc trong 2H tại nội thành đúng như cam kết!",
        "images": [
          "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80"
        ],
        "adminReply": "TechNova chân thành cảm ơn bạn Hoàng Minh Tuấn đã luôn tin tưởng và ủng hộ cửa hàng. Chúc bạn có trải nghiệm công nghệ tuyệt vời!",
        "created_at": "2026-10-25T08:30:00.000Z"
      }
    ],
    "brand": "Sony",
    "isHot": true,
    "isFlashSale": true,
    "soldCount": 297,
    "ratingCount": 83,
    "discountPercent": 7,
    "quickSpecs": [
      "33MP Full-Frame Exmo...",
      "BIONZ XR Image Proce...",
      "4K 60p 10-Bit 4:2:2 ...",
      "Real-time Eye AF Hum..."
    ],
    "variants": [
      {
        "sku": "DFT-STD",
        "color": "Màu Tiêu Chuẩn",
        "storage": "Phiên bản tiêu chuẩn",
        "price": 2499,
        "stock": 15
      },
      {
        "sku": "DFT-PRO",
        "color": "Special Edition Black",
        "storage": "Bản Cao Cấp Full Phụ Kiện",
        "price": 2799,
        "stock": 8
      }
    ]
  },
  {
    "id": 30,
    "name": "DJI Mini 4 Pro Fly More Combo Drone",
    "category": "Accessory",
    "price": 1099,
    "oldPrice": 1199,
    "rating": 4.9,
    "stock": 12,
    "image": "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=800&q=80",
    "description": "Flycam siêu nhẹ dưới 249g tích hợp cảm biến chướng ngại vật đa hướng 360, quay video dọc 4K/60fps HDR và truyền hình ảnh FHD 20km.",
    "specs": [
      "Under 249g Ultra-lightweight",
      "Omnidirectional Obstacle Sensing",
      "4K/60fps HDR True Vertical Shooting",
      "20km FHD Video Transmission"
    ],
    "featured": 1,
    "comments": [
      {
        "id": 260,
        "author": "Hoàng Minh Tuấn",
        "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80",
        "rating": 5,
        "variantPurchased": "Màu Tiêu Chuẩn - Phiên bản tiêu chuẩn",
        "isVerifiedPurchase": true,
        "content": "Sản phẩm đóng gói cực kỳ cẩn thận, nguyên seal chính hãng 100%. Giao hàng siêu tốc trong 2H tại nội thành đúng như cam kết!",
        "images": [
          "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80"
        ],
        "adminReply": "TechNova chân thành cảm ơn bạn Hoàng Minh Tuấn đã luôn tin tưởng và ủng hộ cửa hàng. Chúc bạn có trải nghiệm công nghệ tuyệt vời!",
        "created_at": "2026-10-25T08:30:00.000Z"
      },
      {
        "id": 261,
        "author": "Lê Phương Thảo",
        "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80",
        "rating": 5,
        "variantPurchased": "Special Edition Black - Bản Cao Cấp Full Phụ Kiện",
        "isVerifiedPurchase": true,
        "content": "Build máy hoàn thiện quá xuất sắc! Hiệu năng mượt mà, màn hình màu sắc cực chuẩn cho designer. Đáng từng xu bát gạo.",
        "images": [],
        "adminReply": "Dạ TechNova cảm ơn chị Thảo nhiều ạ! Nếu cần hỗ trợ kỹ thuật chị cứ nhắn hotline 24/7 của bên em nhé.",
        "created_at": "2026-10-27T14:15:00.000Z"
      }
    ],
    "brand": "DJI",
    "isHot": true,
    "isFlashSale": true,
    "soldCount": 370,
    "ratingCount": 104,
    "discountPercent": 8,
    "quickSpecs": [
      "Under 249g Ultra-lig...",
      "Omnidirectional Obst...",
      "4K/60fps HDR True Ve...",
      "20km FHD Video Trans..."
    ],
    "variants": [
      {
        "sku": "DFT-STD",
        "color": "Màu Tiêu Chuẩn",
        "storage": "Phiên bản tiêu chuẩn",
        "price": 1099,
        "stock": 15
      },
      {
        "sku": "DFT-PRO",
        "color": "Special Edition Black",
        "storage": "Bản Cao Cấp Full Phụ Kiện",
        "price": 1231,
        "stock": 8
      }
    ]
  }
];

async function seedProducts() {
  try {
    const pool = await poolPromise;
    if (!pool) return;
    const countRes = await pool.request().query("SELECT COUNT(*) as count FROM products");
    if (countRes.recordset[0].count > 0) {
      console.log('Products table already has data. Skipping manual seed script.');
      return;
    }

    console.log('Seeding enriched products catalog...');
    for (const p of PRODUCTS_DATA) {
      const discount = p.discountPercent || (p.oldPrice ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100) : 0);
      const req = pool.request();
      req.input('name', sql.NVARCHAR, p.name);
      req.input('category', sql.NVARCHAR, p.category);
      req.input('brand', sql.NVARCHAR, p.brand || 'TechNova');
      req.input('price', sql.FLOAT, p.price);
      req.input('oldPrice', sql.FLOAT, p.oldPrice || null);
      req.input('rating', sql.FLOAT, p.rating || 5.0);
      req.input('stock', sql.INT, p.stock || 10);
      req.input('sold_count', sql.INT, p.soldCount || 100);
      req.input('rating_count', sql.INT, p.ratingCount || 25);
      req.input('image', sql.NVARCHAR, p.image);
      req.input('description', sql.NVARCHAR, p.description);
      req.input('specs', sql.NVARCHAR, JSON.stringify(p.specs || []));
      req.input('quick_specs', sql.NVARCHAR, JSON.stringify(p.quickSpecs || []));
      req.input('variants', sql.NVARCHAR, JSON.stringify(p.variants || []));
      req.input('featured', sql.INT, p.isHot ? 1 : (p.featured || 0));
      req.input('is_flash_sale', sql.INT, p.isFlashSale ? 1 : 0);
      req.input('discount_percent', sql.INT, discount);

      await req.query(`
        INSERT INTO products (
          name, category, brand, price, oldPrice, rating, stock, sold_count, rating_count,
          image, description, specs, quick_specs, variants, featured, is_flash_sale, discount_percent
        )
        VALUES (
          @name, @category, @brand, @price, @oldPrice, @rating, @stock, @sold_count, @rating_count,
          @image, @description, @specs, @quick_specs, @variants, @featured, @is_flash_sale, @discount_percent
        )
      `);
    }
    console.log('Products catalog seeded successfully.');
  } catch (err) {
    console.error('Seed products error:', err);
  }
}

module.exports = {
  PRODUCTS_DATA,
  seedProducts
};
