import moment from 'moment'

export const getNotifications = (giftRequests, exchangeRequests, listRequestGift, listRequestExchange) => {
  const formatTimeAgo = timestamp => {
    return moment(timestamp).fromNow()
  }

  return [...giftRequests, ...exchangeRequests, ...listRequestGift, ...listRequestExchange]
    .map(item => ({
      title:
        item?.post_id?.type === 'gift'
          ? `${item?.user_req_id?.name} yêu cầu nhận bài đăng ${item?.post_id?.title}`
          : `${item?.user_req_id?.name} yêu cầu đổi bài đăng ${item?.post_id?.title}`,
      time: formatTimeAgo(item.updated_at)
    }))
    .sort((a, b) => moment(b.time) - moment(a.time)) // Sort by most recent first
    .slice(0, 10) // Limit to 10 most recent notifications
}
