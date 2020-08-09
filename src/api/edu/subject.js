import request from '@/utils/request'

export default {

    // 课程分类列表
    getSubjectList() {

        return request({

            url: '/edu/subject/getAllSubject',
            method: 'get'
        })
    }

}
