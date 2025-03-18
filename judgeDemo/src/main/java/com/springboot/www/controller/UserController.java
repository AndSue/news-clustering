package com.springboot.www.controller;

import com.springboot.www.entity.User;
import com.springboot.www.entity.Result;
import com.springboot.www.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;

@CrossOrigin(origins = "*",maxAge = 3600)
@RestController
@RequestMapping(value = "/user",method = RequestMethod.POST)
public class UserController {
    @Autowired
    private UserServiceImpl userService;

    //添加新用户
    @PostMapping("/add")
    @ResponseBody
    public Result addNewUser(@RequestBody User user){
        int addRows=userService.add(user);
        Result res=new Result();
        if(addRows>0){
            res.setMsg("添加成功！");
        }
        else{
            res.setCode(201);
            res.setSuccess(false);
            res.setMsg("添加失败！");
        }
        return res;
    }

    //根据id删除用户
    @PostMapping("/delete")
    @ResponseBody
    public Result delete(@RequestBody User user){
        Result res=new Result();
        int deletedRows=userService.delete(user.getId());
        if(deletedRows>0){
            res.setMsg("删除成功！");
        }
        else{
            res.setCode(201);
            res.setSuccess(false);
            res.setMsg("删除失败！");
        }
        return res;
    }

    //修改用户数值
    @PostMapping("/update")
    @ResponseBody
    public Result update(@RequestBody User user){
        int updatedRows= userService.update(user);
        Result res=new Result();
        if(updatedRows>0){
            res.setMsg("更新成功！");
        }
        else{
            res.setCode(201);
            res.setSuccess(false);
            res.setMsg("更新失败！");
        }
        return res;
    }

    //修改用户数值
    @PostMapping("/updatePassword")
    @ResponseBody
    public Result updatePassword(@RequestBody User user){
        int updatedRows= userService.updatePassword(user);
        Result res=new Result();
        if(updatedRows>0){
            res.setMsg("更新成功！");
        }
        else{
            res.setCode(201);
            res.setSuccess(false);
            res.setMsg("更新失败！");
        }
        return res;
    }

    //展示所有用户
    @GetMapping("/showAll")
    @ResponseBody
    public Result showAllUsers(){
        Result res=new Result();
        res.setData(userService.showAll());
        res.setMsg("搜索成功！");
        return res;
    }

    //模糊查找用户
    @PostMapping("/find")
    @ResponseBody
    public Result find(@RequestBody User user){
        Result res=new Result();
        res.setData(userService.find(user));
        res.setMsg("搜索成功！");
        return res;
    }

    //模糊查找用户
    @PostMapping("/findById")
    @ResponseBody
    public Result findById(@RequestBody User user){
        Result res=new Result();
        res.setData(userService.findById(user.getId()));
        res.setMsg("搜索成功！");
        return res;
    }

    //用户登录
    @PostMapping("/login")
    @ResponseBody
    public Result userLogin(@RequestBody User user){
        User result=userService.login(user.getName(), user.getPassword());
        Result res=new Result();
        if(result!=null){
            res.setMsg("登录成功！");
            res.setData(result);
        }
        else{
            res.setMsg("登录失败！");
            res.setSuccess(false);
            res.setCode(201);
        }
        return res;
    }

    //上传头像
    @PostMapping(value = "/uploadingPhoto")
    @ResponseBody
    public String uploadFile(@RequestBody MultipartFile file,String uid) {
        System.out.println("接收到的文件数据为：" + file);
        if (file.isEmpty()) {
            return "上传文件为空";
        }
        // 获取文件全名a.py
        String fileName = file.getOriginalFilename();
        // 文件上传路径
        String templatePath = "E:/VueProjects/flower/src/assets/user/";
        System.out.println("文件路径:" + templatePath);
        // 获取文件的后缀名
        //String suffixName = fileName.substring(fileName.lastIndexOf("."));
        //获取文件名
        String prefixName = fileName.substring(0, fileName.lastIndexOf("."));
        // 解决中文问题,liunx 下中文路径,图片显示问题
        //fileName = UUID.randomUUID() + suffixName;
        String name="user"+uid+".jpg";
        File dest0 = new File(templatePath);
        File dest = new File(dest0, name);
        //文件上传-覆盖
        try {
            // 检测是否存在目录
            if (!dest0.getParentFile().exists()) {
                dest0.getParentFile().mkdirs();
                //检测文件是否存在
            }
            if (!dest.exists()) {
                dest.mkdirs();
            }
            file.transferTo(dest);
            userService.updatePhoto(Integer.parseInt(uid),name);
            return "上传成功";
        } catch (Exception e) {
            System.out.println("文件上传错误");
            return "上传失败";
        }
    }

    //上传表格
    @PostMapping(value = "/uploadingTable")
    @ResponseBody
    public Result uploadTable(@RequestBody MultipartFile file,String uid) {
        System.out.println("接收到的文件数据为：" + file);
        Result res=new Result();
        if (file.isEmpty()) {
            res.setCode(203);
            res.setMsg("上传文件为空");
            res.setSuccess(false);
            return res;
        }
        // 获取文件全名a.py
        String fileName = file.getOriginalFilename();
        System.out.println("文件名："+fileName);
        // 文件上传路径
        String templatePath = "E:/0系统/judge-news-app/src/files/";
        System.out.println("文件路径:" + templatePath);
        // 获取文件的后缀名
        String suffixName = fileName.substring(fileName.lastIndexOf("."));
        //获取文件名
        String prefixName = fileName.substring(0, fileName.lastIndexOf("."));
        // 解决中文问题,liunx 下中文路径,图片显示问题
        //fileName = UUID.randomUUID() + suffixName;
        uid=uid.substring(1,uid.length()-1);
        String name="user"+uid+suffixName;
        System.out.println("输出文件名："+name);
        File dest0 = new File(templatePath);
        File dest = new File(dest0, name);
        //文件上传-覆盖
        try {
            // 检测是否存在目录
            if (!dest0.getParentFile().exists()) {
                dest0.getParentFile().mkdirs();
                //检测文件是否存在
            }
            file.transferTo(dest);
            userService.updatePhoto(Integer.parseInt(uid),name);
            res.setMsg("上传成功！");
        } catch (Exception e) {
            e.printStackTrace();
            res.setMsg("登录失败！");
            res.setSuccess(false);
            res.setCode(202);
        }
        return res;
    }
}
