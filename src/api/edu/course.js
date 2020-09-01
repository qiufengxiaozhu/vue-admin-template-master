import request from '@/utils/request'

export default {

    // 添加课程信息
    addCourseInfo(courseInfo) {

        return request({

            url: '/edu/course/addCouserInfo',
            method: 'post',
            data: courseInfo
        })
    },

    // 查询所有讲师信息，用于在添加课程信息时关联显示
    getTeacherList() {

        return request({

            url: '/edu/teacher/findAll',
            method: 'get'
        })
    },

    // 根据课程id查询课程信息
    getCourseInfo(courseId) {

        return request({

            url: `/edu/course/getCourseInfo/${courseId}`,
            method: 'get'
        })
    },

    // 修改课程信息
    updateCourseInfo(courseInfo) {

        return request({

            url: '/edu/course/updateCourseInfo',
            method: 'post',
            data: courseInfo
        })
    },

    // 课程发布信息显示
    getPublishCourseInfo(courseId) {

        return request({

            url: `/edu/course/getPublishCourseInfo/${courseId}`,
            method: 'get'
        })
    },

    // 课程最终发布
    submitPublishCourse(courseId) {

        return request({

            url: `/edu/course/publishCourse/${courseId}`,
            method: 'post'
        })
    },

    // 课程列表查询（不附加条件，分页查询所有）
    selectCourseByPage(current, limit) {

        return request({

            url: `/edu/course/pageCourse/${current}/${limit}`,
            method: 'post'
        })
    },

    // 课程列表查询（【附加】条件，分页查询所有）
    selectCourseByCondition(current, limit, courseQuery) {

        return request({

            url: `/edu/course/pageCourseCondition/${current}/${limit}`,
            method: 'post',
            data: courseQuery
        })
    }
}
