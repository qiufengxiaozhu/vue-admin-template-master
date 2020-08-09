import request from '@/utils/request'

export default {

    // 讲师列表 （分页查询带条件）
    // current当前页 limit每页记录数 teacherQuery条件对象
    getTeacherListPage(current, limit, teacherQuery) {

        return request({

          // url: '/eduservice/teacher/pageTeacherCondition/'+current+"/"+limit,
          // 使用 飘 符号，效果更佳,然后参数可以直接添加，类似 EL 表达式 省去了字符串拼接的麻烦
          url: `/edu/teacher/pageTeacherCondition/${current}/${limit}`,
          method: 'post',
          // teacherQuery条件对象，后端使用RequestBody获取数据
          // data表示把对象转换json进行传递到接口里面
          data: teacherQuery
        })
    },

    // 通过id删除讲师信息,delete提交
    deleteTeacherId(id) {

        return request({

          url: `/edu/teacher/${id}`,
          method: 'delete'

        })
    },

    // 添加讲师
    addTeacher(teacher) {

        return request({

          url: `/edu/teacher/addTeacher`,
          method: 'post',
          data: teacher

        })
    },

    // 通过id查询讲师信息
    getTeacherInfo(id) {

        return request({

          url: `/edu/teacher/getTeacher/${id}`,
          method: 'get'

        })
    },

    // 修改讲师信息
    updateTeacherInfo(teacher) {

        return request({

            url: `/edu/teacher/updateTeacher`,
            method: 'post',
            data: teacher

        })
    }
}
