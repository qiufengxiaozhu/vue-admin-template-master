import request from '@/utils/request'

export default {

    // 根据课程id， 获取其中的章节小节
    addVideo(video) {

        return request({

            url: `/edu/video/addVideo`,
            method: 'post',
            data: video

        })
    },

    // 删除小节
    deleteVideo(id) {

        return request({

            url: `/edu/video/${id}`,
            method: 'delete'
        })
    },

    // 根据小节id查询小节信息
    getVideoInfo(videoId) {

        return request({

            url: `/edu/video/getVideoInfo/${videoId}`,
            method: 'get'
        })
    },

    // 修改小节信息
    updateVideo(video) {

        return request({

            url: `/edu/video/updateVideo`,
            method: 'post',
            data: video
        })
    },
}
