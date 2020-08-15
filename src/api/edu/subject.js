import request from '@/utils/request'

export default {

    // 课程分类列表  （包括所有的一级以及二级分类）
    getSubjectList() {

        return request({

            url: '/edu/subject/getAllSubject',
            method: 'get'
        })
    }

}
