type CB = () => void

const queue = [] as CB[]
const postQueue = [] as CB[]

export function queueJob(cb: CB) {
  !queue.includes(cb) && queue.push(cb)
  flushJobs()
}

export function queuePostFlushCb(cb: CB) {
  !queue.includes(cb) && queue.push(cb)
  flushJobs()
}

let flushing = false

function flushJobs() {
  if (flushing) return
  flushing = true
  Promise.resolve().then(() => {
    while(queue.length || postQueue.length) {
      while(queue.length) queue.shift()!()
      while(postQueue.length) postQueue.shift()!()
    }
  }).finally(() => {
    flushing = false
  })
}