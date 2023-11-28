# TaxiAppServer
cài đặt thư viện
- npm install
cài đặt csdl:
- Tạo database tên "taxiappdb" trong postgres
- Cài đặt extension PostGis cho postgres theo hướng dẫn: https://mappitall.com/blog/how-to-install-postgis
- Thay đổi username/password của postgres ở file config.json
- Thay đổi username/password của postgres ở file controllers/bookingController dòng const sequelize =....
- Khởi động "node index.js"
- Truy cập: http://localhost:5000/sync để tạo csdl
- Khởi động "sequelize db:seed:all" để tạo dữ liệu mẫu