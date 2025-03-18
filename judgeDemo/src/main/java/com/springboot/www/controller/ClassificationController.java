package com.springboot.www.controller;

import com.springboot.www.entity.*;
import com.springboot.www.service.NewsServiceImpl;
import com.springboot.www.service.RecordServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.expression.spel.ast.NullLiteral;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.util.ArrayList;
import java.util.List;

@CrossOrigin(origins = "*",maxAge = 3600)
@RestController
@RequestMapping(value = "/classification",method = RequestMethod.POST)
public class ClassificationController {
    @Autowired
    private NewsServiceImpl newsService;
    @Autowired
    private RecordServiceImpl recordService;

    //爬取指定日期的新闻
    @PostMapping("/spider")
    @ResponseBody
    public Result spider(@RequestBody Spider spider){
        Result result=new Result();
        List<News> newsList=newsService.getNews(spider.getStart_date(),spider.getEnd_date());
        result.setData(newsList);
        result.setMsg("爬取成功！");
        return result;
    }

    //爬取指定日期的新闻
    @PostMapping("/classify")
    @ResponseBody
    public Result classify(@RequestBody Classify info){
        Result result=new Result();
        List<News> list=new ArrayList<>();
        //添加记录
        Record record=new Record();
        record.setModel(info.getModel());
        record.setMethod(info.getMethod());
        record.setUser_id(info.getUid());
        record.setStatus(0);
        record.setType_num(info.getModel().equals("label")?10:info.getType_num());
        record.setId(-1);
        int rows=recordService.add(record);
        if(rows>0){
            //获取记录编号
            List<Record> recordList=recordService.show(record);
            int id=-1;
            for(Record r1:recordList){
                id=r1.getId();
                break;
            }
            record.setId(id);
            if(id!=-1){
                //开始聚类
                News news=new News();
                List<News> newsList=null;
                //固定模式
                if(info.getModel().equals("label")) {
                    newsList=newsService.classifyWithLabel(info.getData(), record.getId(),record.getMethod());
                }
                else{
                    newsList=newsService.classifyWithoutLabel(info.getData(), record.getId(), info.getType_num(),record.getMethod());
                }
                if(newsList != null){
                    //添加新闻
                    newsService.add(newsList);
                    news.setRecord_id(id);
                    list=newsService.show(news);
                }
                //修改记录的状态
                recordService.updateStatus(record);
            }
        }
        result.setData(list);
        result.setMsg("分类成功！");
        return result;
    }

    //爬取指定日期的新闻
    @PostMapping("/getKeywords")
    @ResponseBody
    public Result getKeywords(@RequestBody News anews){
        Result result=new Result();
        List<News> newsList=newsService.show(anews);
        String text="";
        for(News news:newsList){
            text=text+news.getTitle()+news.getContent();
        }
        String str=newsService.getKeywords(text);
        result.setData(str);
        result.setMsg("提取关键词成功！");
        return result;
    }
}
