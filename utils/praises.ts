import { PraiseMessage } from '@/types'

const praiseMessages: PraiseMessage[] = [
  { message: 'Tuyệt vời!', emoji: '🌟' },
  { message: 'Xuất sắc!', emoji: '🎉' },
  { message: 'Giỏi lắm!', emoji: '👏' },
  { message: 'Tốt quá!', emoji: '👍' },
  { message: 'Đáng khen!', emoji: '⭐' },
  { message: 'Rất tốt!', emoji: '🏆' },
  { message: 'Hoàn hảo!', emoji: '💯' },
  { message: 'Tuyệt đối!', emoji: '🎯' },
  { message: 'Cố gắng tốt!', emoji: '💪' },
  { message: 'Rất đáng khen!', emoji: '🥇' },
  { message: 'Làm tốt lắm!', emoji: '🎊' },
  { message: 'Tuyệt vời quá!', emoji: '🔥' },
  { message: 'Giỏi quá đi!', emoji: '😊' },
  { message: 'Đáng tự hào!', emoji: '🌈' },
  { message: 'Rất xuất sắc!', emoji: '✨' },
]

export function getPraiseMessage(score: number): PraiseMessage {
  // Get praise message based on score
  if (score >= 90) {
    // Excellent scores
    const excellentMessages = praiseMessages.filter((_, i) => [0, 1, 6, 7, 14].includes(i))
    const randomIndex = Math.floor(Math.random() * excellentMessages.length)
    return excellentMessages[randomIndex]
  } else if (score >= 70) {
    // Good scores
    const goodMessages = praiseMessages.filter((_, i) => [2, 3, 4, 5, 9, 11, 12].includes(i))
    const randomIndex = Math.floor(Math.random() * goodMessages.length)
    return goodMessages[randomIndex]
  } else {
    // Encouraging messages for lower scores
    const encouragingMessages = praiseMessages.filter((_, i) => [8, 12, 13].includes(i))
    const randomIndex = Math.floor(Math.random() * encouragingMessages.length)
    return encouragingMessages[randomIndex]
  }
}

