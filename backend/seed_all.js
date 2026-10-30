const bcrypt = require('bcryptjs');

async function seedAllData(pool, sql) {
  try {
    // ==========================================
    // 1. SEED USERS & ADMIN ACCOUNTS
    // ==========================================
    const userCheck = await pool.request().query("SELECT COUNT(*) as count FROM users WHERE role = 'admin'");
    if (userCheck.recordset[0].count === 0) {
      console.log('Seeding admin and customer accounts...');
      const adminPassHash = await bcrypt.hash('admin123', 10);
      const userPassHash = await bcrypt.hash('123456', 10);

      const defaultUsers = [
        {
          fullname: 'Quản Lý Trưởng',
          email: 'admin@technova.vn',
          phone: '0987654321',
          password: adminPassHash,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          role: 'admin'
        },
        {
          fullname: 'Quản Trị Viên Hệ Thống',
          email: 'admin',
          phone: '0900000000',
          password: adminPassHash,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          role: 'admin'
        },
        {
          fullname: 'Nguyễn Văn An',
          email: 'an.nguyen@gmail.com',
          phone: '0912345678',
          password: userPassHash,
          avatar: 'https://i.pravatar.cc/150?img=11',
          role: 'user'
        },
        {
          fullname: 'Trần Thị Mai',
          email: 'mai.tran@gmail.com',
          phone: '0987654321',
          password: userPassHash,
          avatar: 'https://i.pravatar.cc/150?img=32',
          role: 'user'
        },
        {
          fullname: 'Lê Hoàng Minh',
          email: 'minh.le@gmail.com',
          phone: '0933221100',
          password: userPassHash,
          avatar: 'https://i.pravatar.cc/150?img=68',
          role: 'user'
        },
        {
          fullname: 'Phạm Thu Hà',
          email: 'ha.pham@gmail.com',
          phone: '0977889900',
          password: userPassHash,
          avatar: 'https://i.pravatar.cc/150?img=47',
          role: 'user'
        },
        {
          fullname: 'Vũ Tuấn Kiệt',
          email: 'kiet.vu@gmail.com',
          phone: '0909123456',
          password: userPassHash,
          avatar: 'https://i.pravatar.cc/150?img=12',
          role: 'user'
        }
      ];

      for (const u of defaultUsers) {
        await pool.request()
          .input('fullname', sql.NVARCHAR, u.fullname)
          .input('email', sql.NVARCHAR, u.email)
          .input('phone', sql.NVARCHAR, u.phone)
          .input('password', sql.NVARCHAR, u.password)
          .input('avatar', sql.NVARCHAR, u.avatar)
          .input('role', sql.NVARCHAR, u.role)
          .query(`
            IF NOT EXISTS (SELECT 1 FROM users WHERE LOWER(email) = LOWER(@email))
            BEGIN
              INSERT INTO users (fullname, email, phone, password, avatar, role)
              VALUES (@fullname, @email, @phone, @password, @avatar, @role)
            END
          `);
      }
      console.log('Seeded users and admin accounts successfully.');
    }

    // ==========================================
    // 2. SEED COMMENTS & REVIEWS
    // ==========================================
    const commentCheck = await pool.request().query("SELECT COUNT(*) as count FROM comments");
    if (commentCheck.recordset[0].count === 0) {
      console.log('Seeding customer comments and reviews...');
      const prodsResult = await pool.request().query("SELECT id, name, category FROM products");
      const prods = prodsResult.recordset;

      const sampleReviews = [
        {
          author: 'Nguyễn Văn An',
          avatar: 'https://i.pravatar.cc/150?img=11',
          rating: 5,
          content: 'Sản phẩm dùng rất mượt, đóng gói cẩn thận, giao hàng trong ngày. Rất hài lòng!',
          variant: 'Bản Tiêu Chuẩn (Standard Edition)',
          reply: 'Cảm ơn bạn An đã luôn tin tưởng và ủng hộ TechNova Store!'
        },
        {
          author: 'Trần Thị Mai',
          avatar: 'https://i.pravatar.cc/150?img=32',
          rating: 5,
          content: 'Thiết kế đẹp mắt sang trọng, shop tư vấn tận tình chu đáo. Đáng từng đồng!',
          variant: 'Titanium Tự Nhiên - 256GB',
          reply: 'TechNova cảm ơn đánh giá tuyệt vời của bạn Mai ạ!'
        },
        {
          author: 'Lê Hoàng Minh',
          avatar: 'https://i.pravatar.cc/150?img=68',
          rating: 4,
          content: 'Chất lượng hoàn thiện cực tốt, âm thanh hay và pin trâu. Giao hàng mất 2 ngày hơi chậm xíu.',
          variant: 'Đen Không Gian (Space Black)',
          reply: 'Dạ TechNova sẽ cố gắng tối ưu đối tác vận chuyển để giao nhanh hơn nữa ạ!'
        },
        {
          author: 'Phạm Thu Hà',
          avatar: 'https://i.pravatar.cc/150?img=47',
          rating: 5,
          content: 'Hàng chính hãng mới 100%, bảo hành điện tử nhanh chóng. Rất yên tâm khi mua tại đây.',
          variant: 'Bạc Ánh Kim (Silver)',
          reply: 'Cảm ơn chị Hà, chúc chị có trải nghiệm tuyệt vời cùng sản phẩm!'
        },
        {
          author: 'Vũ Tuấn Kiệt',
          avatar: 'https://i.pravatar.cc/150?img=12',
          rating: 5,
          content: 'Hiệu năng cực đỉnh, render video 4K siêu nhanh không bị nóng máy. 10/10 điểm!',
          variant: 'Bản Nâng Cấp 32GB RAM / 1TB SSD',
          reply: 'Cảm ơn bạn Kiệt đã chia sẻ đánh giá thực tế ạ!'
        }
      ];

      for (let i = 0; i < prods.length; i++) {
        const prod = prods[i];
        // Seed 1-2 comments per product
        const rev1 = sampleReviews[i % sampleReviews.length];
        const rev2 = sampleReviews[(i + 2) % sampleReviews.length];

        const req1 = pool.request();
        req1.input('pid', sql.INT, prod.id);
        req1.input('author', sql.NVARCHAR, rev1.author);
        req1.input('avatar', sql.NVARCHAR, rev1.avatar);
        req1.input('rating', sql.INT, rev1.rating);
        req1.input('content', sql.NVARCHAR, rev1.content);
        req1.input('variant', sql.NVARCHAR, rev1.variant);
        req1.input('reply', sql.NVARCHAR, rev1.reply);
        await req1.query(`
          INSERT INTO comments (product_id, author, avatar, rating, content, variant_purchased, is_verified_purchase, admin_reply)
          VALUES (@pid, @author, @avatar, @rating, @content, @variant, 1, @reply)
        `);

        if (i < 10) {
          const req2 = pool.request();
          req2.input('pid', sql.INT, prod.id);
          req2.input('author', sql.NVARCHAR, rev2.author);
          req2.input('avatar', sql.NVARCHAR, rev2.avatar);
          req2.input('rating', sql.INT, rev2.rating);
          req2.input('content', sql.NVARCHAR, rev2.content);
          req2.input('variant', sql.NVARCHAR, rev2.variant);
          req2.input('reply', sql.NVARCHAR, i % 2 === 0 ? rev2.reply : null);
          await req2.query(`
            INSERT INTO comments (product_id, author, avatar, rating, content, variant_purchased, is_verified_purchase, admin_reply)
            VALUES (@pid, @author, @avatar, @rating, @content, @variant, 1, @reply)
          `);
        }
      }
      console.log('Seeded customer comments successfully.');
    }

    // ==========================================
    // 3. SEED ORDERS & ORDER ITEMS
    // ==========================================
    const orderCheck = await pool.request().query("SELECT COUNT(*) as count FROM orders");
    if (orderCheck.recordset[0].count === 0) {
      console.log('Seeding sample orders and items...');
      const prodsResult = await pool.request().query("SELECT TOP 10 id, name, price FROM products ORDER BY id ASC");
      const sampleProds = prodsResult.recordset;

      if (sampleProds.length > 0) {
        const sampleOrders = [
          {
            name: 'Nguyễn Văn An',
            email: 'an.nguyen@gmail.com',
            phone: '0912345678',
            address: '123 Nguyễn Trãi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh',
            payment: 'COD',
            total: sampleProds[0]?.price || 2499,
            status: 'Delivered',
            paymentStatus: 'Paid',
            items: [{ prod: sampleProds[0], qty: 1 }]
          },
          {
            name: 'Trần Thị Mai',
            email: 'mai.tran@gmail.com',
            phone: '0987654321',
            address: '456 Đường Cầu Giấy, Quận Cầu Giấy, TP. Hà Nội',
            payment: 'Credit Card',
            total: sampleProds[1]?.price || 1199,
            status: 'Processing',
            paymentStatus: 'Paid',
            items: [{ prod: sampleProds[1] || sampleProds[0], qty: 1 }]
          },
          {
            name: 'Lê Hoàng Minh',
            email: 'minh.le@gmail.com',
            phone: '0933221100',
            address: '789 Đường Lê Duẩn, Quận Hải Châu, TP. Đà Nẵng',
            payment: 'Banking',
            total: sampleProds[2]?.price || 349,
            status: 'Pending',
            paymentStatus: 'Unpaid',
            items: [{ prod: sampleProds[2] || sampleProds[0], qty: 1 }]
          },
          {
            name: 'Phạm Thu Hà',
            email: 'ha.pham@gmail.com',
            phone: '0977889900',
            address: '102 Đường Trần Phú, Quận Ngô Quyền, TP. Hải Phòng',
            payment: 'Momo',
            total: (sampleProds[3]?.price || 799) + (sampleProds[4]?.price || 99),
            status: 'Shipped',
            paymentStatus: 'Paid',
            items: [
              { prod: sampleProds[3] || sampleProds[0], qty: 1 },
              { prod: sampleProds[4] || sampleProds[0], qty: 1 }
            ]
          },
          {
            name: 'Vũ Tuấn Kiệt',
            email: 'kiet.vu@gmail.com',
            phone: '0909123456',
            address: '25 Đường Võ Văn Tần, Quận 3, TP. Hồ Chí Minh',
            payment: 'COD',
            total: sampleProds[6]?.price || 1299,
            status: 'Delivered',
            paymentStatus: 'Paid',
            items: [{ prod: sampleProds[6] || sampleProds[0], qty: 1 }]
          },
          {
            name: 'Hoàng Đức Anh',
            email: 'anh.hoang@gmail.com',
            phone: '0944556677',
            address: '88 Đường Hùng Vương, Quận Ninh Kiều, TP. Cần Thơ',
            payment: 'Banking',
            total: sampleProds[7]?.price || 799,
            status: 'Delivered',
            paymentStatus: 'Paid',
            items: [{ prod: sampleProds[7] || sampleProds[0], qty: 1 }]
          },
          {
            name: 'Đặng Bích Ngọc',
            email: 'ngoc.dang@gmail.com',
            phone: '0966112233',
            address: '15 Đường Quang Trung, TP. Nha Trang, Khánh Hòa',
            payment: 'Credit Card',
            total: sampleProds[0]?.price || 2499,
            status: 'Delivered',
            paymentStatus: 'Paid',
            items: [{ prod: sampleProds[0], qty: 1 }]
          },
          {
            name: 'Nguyễn Văn An',
            email: 'an.nguyen@gmail.com',
            phone: '0912345678',
            address: '123 Nguyễn Trãi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh',
            payment: 'Banking',
            total: sampleProds[2]?.price || 349,
            status: 'Processing',
            paymentStatus: 'Paid',
            items: [{ prod: sampleProds[2] || sampleProds[0], qty: 1 }]
          }
        ];

        for (const ord of sampleOrders) {
          const ordReq = pool.request();
          ordReq.input('name', sql.NVARCHAR, ord.name);
          ordReq.input('email', sql.NVARCHAR, ord.email);
          ordReq.input('phone', sql.NVARCHAR, ord.phone);
          ordReq.input('addr', sql.NVARCHAR, ord.address);
          ordReq.input('pay', sql.NVARCHAR, ord.payment);
          ordReq.input('amt', sql.FLOAT, ord.total);
          ordReq.input('status', sql.NVARCHAR, ord.status);
          ordReq.input('payStatus', sql.NVARCHAR, ord.paymentStatus);

          const insertedOrd = await ordReq.query(`
            INSERT INTO orders (customer_name, email, phone, address, payment_method, total_amount, status, payment_status)
            OUTPUT INSERTED.id
            VALUES (@name, @email, @phone, @addr, @pay, @amt, @status, @payStatus)
          `);

          const newOrderId = insertedOrd.recordset[0].id;
          for (const item of ord.items) {
            const itemReq = pool.request();
            itemReq.input('oid', sql.INT, newOrderId);
            itemReq.input('pid', sql.INT, item.prod.id);
            itemReq.input('pname', sql.NVARCHAR, item.prod.name);
            itemReq.input('price', sql.FLOAT, item.prod.price);
            itemReq.input('qty', sql.INT, item.qty);
            await itemReq.query(`
              INSERT INTO order_items (order_id, product_id, product_name, price, quantity)
              VALUES (@oid, @pid, @pname, @price, @qty)
            `);
          }
        }
        console.log(`Seeded ${sampleOrders.length} sample orders successfully.`);
      }
    }

    // ==========================================
    // 4. SEED CONTACT MESSAGES
    // ==========================================
    const msgCheck = await pool.request().query("SELECT COUNT(*) as count FROM contact_messages");
    if (msgCheck.recordset[0].count === 0) {
      console.log('Seeding customer contact messages...');
      const sampleMessages = [
        {
          name: 'Nguyễn Văn An',
          email: 'an.nguyen@gmail.com',
          phone: '0912345678',
          subject: 'Hỗ trợ kỹ thuật AppleCare+',
          message: 'Shop cho mình hỏi gói bảo hành AppleCare+ cho MacBook Pro có áp dụng tận nơi không ạ?',
          status: 'New'
        },
        {
          name: 'Trần Thị Mai',
          email: 'mai.tran@gmail.com',
          phone: '0987654321',
          subject: 'Tư vấn mua sỉ cho doanh nghiệp',
          message: 'Công ty mình muốn đặt số lượng 5 máy iPhone 15 Pro Max, nhờ shop báo giá và chiết khấu giúp mình.',
          status: 'Replied'
        },
        {
          name: 'Lê Hoàng Minh',
          email: 'minh.le@gmail.com',
          phone: '0933221100',
          subject: 'Tiến độ giao hàng đơn #ord-0003',
          message: 'Đơn hàng của mình đã thanh toán chuyển khoản thành công, nhờ shop kiểm tra và đóng gói gửi sớm giúp mình nhé!',
          status: 'New'
        },
        {
          name: 'Đỗ Hoàng Nam',
          email: 'nam.do@gmail.com',
          phone: '0922334455',
          subject: 'Yêu cầu xuất hóa đơn VAT điện tử',
          message: 'Mình vừa đặt hàng màn hình Dell UltraSharp, shop vui lòng xuất hóa đơn VAT cho Công ty TNHH Công Nghệ Nam Phát giúp mình.',
          status: 'New'
        }
      ];

      for (const m of sampleMessages) {
        await pool.request()
          .input('name', sql.NVARCHAR, m.name)
          .input('email', sql.NVARCHAR, m.email)
          .input('phone', sql.NVARCHAR, m.phone)
          .input('sub', sql.NVARCHAR, m.subject)
          .input('msg', sql.NVARCHAR, m.message)
          .input('status', sql.NVARCHAR, m.status)
          .query(`
            INSERT INTO contact_messages (name, email, phone, subject, message, status)
            VALUES (@name, @email, @phone, @sub, @msg, @status)
          `);
      }
      console.log('Seeded contact messages successfully.');
    }
  } catch (err) {
    console.error('Error seeding admin and demo data:', err.message || err);
  }
}

module.exports = { seedAllData };
