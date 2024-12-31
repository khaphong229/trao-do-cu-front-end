export const initialFakeListings = [
  {
    id: 1,
    avatar: 'https://via.placeholder.com/50',
    username: 'Nguyễn Văn A',
    title: 'Bàn làm việc gỗ',
    description: 'Bàn làm việc chất liệu gỗ tự nhiên, còn mới 90%.',
    images: ['https://via.placeholder.com/150', 'https://via.placeholder.com/150'],
    type: 'gift',
    registrations: [
      { id: 1, username: 'Người nhận 1', avatar: 'https://via.placeholder.com/40' },
      { id: 2, username: 'Người nhận 2', avatar: 'https://via.placeholder.com/40' },
      { id: 3, username: 'Người nhận 3', avatar: 'https://via.placeholder.com/40' }
    ],
    status: 'active'
  },
  {
    id: 2,
    avatar: 'https://via.placeholder.com/50',
    username: 'Trần Thị B',
    title: 'Laptop Dell cũ',
    description: 'Laptop Dell Inspiron, sử dụng tốt, cần trao đổi đồ dùng học tập.',
    images: ['https://via.placeholder.com/150'],
    type: 'exchange',
    registrations: [
      {
        id: 4,
        username: 'Người trao đổi 1',
        avatar: 'https://via.placeholder.com/40',
        exchangeOffer: {
          description: 'Tôi muốn trao đổi laptop này với một bộ sách giáo khoa đại học.',
          images: ['https://via.placeholder.com/150', 'https://via.placeholder.com/150']
        }
      },
      {
        id: 5,
        username: 'Người trao đổi 2',
        avatar: 'https://via.placeholder.com/40',
        exchangeOffer: {
          description: 'Tôi có một máy tính bảng mới, muốn trao đổi với laptop của bạn.',
          images: ['https://via.placeholder.com/150']
        }
      }
    ],
    status: 'active'
  },
  {
    id: 3,
    avatar: 'https://via.placeholder.com/50',
    username: 'Phạm Văn C',
    title: 'Tủ quần áo cần thanh lý',
    description: 'Tủ quần áo gỗ công nghiệp, thích hợp cho sinh viên hoặc gia đình nhỏ.',
    images: ['https://via.placeholder.com/150', 'https://via.placeholder.com/150', 'https://via.placeholder.com/150'],
    type: 'gift',
    registrations: [
      { id: 6, username: 'Người nhận A', avatar: 'https://via.placeholder.com/40' },
      { id: 7, username: 'Người nhận B', avatar: 'https://via.placeholder.com/40' }
    ],
    status: 'active'
  }
]
