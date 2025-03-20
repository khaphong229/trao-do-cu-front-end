import React from 'react'
import UserSurveyComponent from './components/UserSurvey'
import SEO from 'config/seo'
const UserSurvey = () => {
  return (
    <div className="container">
      <SEO
        title="Trao Đồ Cũ - Khảo sát người dùng"
        description="Khảo sát sở thích thể loại đồ của người dùng để tăng chất lượng, trải nghiệm cho người dùng."
        keywords={['trao đồ cũ, trao đổi, trao tặng, xin đồ, chợ đồ cũ']}
        url="https://traodocu.vn"
      />
      <UserSurveyComponent />
    </div>
  )
}

export default UserSurvey
