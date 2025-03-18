package com.springboot.www.controller;

import com.springboot.www.entity.News;
import com.springboot.www.entity.Record;
import com.springboot.www.entity.Result;
import com.springboot.www.service.NewsServiceImpl;
import com.springboot.www.service.RecordServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*",maxAge = 3600)
@RestController
@RequestMapping(value = "/record",method = RequestMethod.POST)
public class RecordController {
    @Autowired
    private RecordServiceImpl recordService;
    @Autowired
    private NewsServiceImpl newsService;

    //按照用户id展示
    @PostMapping("/show")
    @ResponseBody
    public Result show(@RequestBody Record record){
        Result result=new Result();
        result.setData(recordService.show(record));
        result.setMsg("查找成功！");
        return result;
    }

    @PostMapping("/showNews")
    @ResponseBody
    public Result showNews(@RequestBody News news){
        Result result=new Result();
        result.setData(newsService.show(news));
        result.setMsg("查找成功！");
        return result;
    }

    @PostMapping("/add")
    @ResponseBody
    public Result add(@RequestBody Record record){
        Result result=new Result();
        if(recordService.add(record)>0){
            result.setMsg("添加成功！");
        }
        else{
            result.setSuccess(false);
            result.setCode(201);
            result.setMsg("添加失败！");
        }
        return result;
    }

    //模糊查找记录
    @PostMapping("/delete")
    @ResponseBody
    public Result delete(@RequestBody Record record){
        Result result=new Result();
        if(recordService.delete(record.getId())>0 && newsService.delete(record.getId())>0) {
            result.setMsg("删除成功！");
            return result;
        }
        result.setMsg("删除失败！");
        result.setCode(201);
        result.setSuccess(false);
        return result;
    }
}
