import request from '@/utils/request'

export default {

    // 根据课程id， 获取其中的章节小节
    getAllChapterVideo(courseId) {

        return request({

            url: `/edu/chapter/getChapterVideo/${courseId}`,
            method: 'get'
        })
    },

    // 添加章节
    addChapter(chapter) {

        return request({

            url: `/edu/chapter/addChapter`,
            method: 'post',
            data: chapter
        })
    },

    // 根据章节id查询章节信息
    getChapterInfo(chapterId) {

        return request({

            url: `/edu/chapter/getChapterInfo/${chapterId}`,
            method: 'get'
        })
    },

    // 修改章节信息
    updateChapter(chapter) {

        return request({

            url: `/edu/chapter/updateChapter`,
            method: 'post',
            data: chapter
        })
    },

    // 根据id删除章节
    deleteChapter(chapterId) {

        return request({

            url: `/edu/chapter/${chapterId}`,
            method: 'delete'
        })
    },



}
