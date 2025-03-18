package com.springboot.www.dao;

import com.springboot.www.entity.Record;
import com.springboot.www.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
@Service
public class RecordDao {
    @Autowired(required = false)
    JdbcTemplate jdbcTemplate;

    public int add(Record record){
        return jdbcTemplate.update("insert into record(type_num,user_id,model,method) values(?,?,?,?)",record.getType_num(),record.getUser_id(),record.getModel(),record.getMethod());
       // return jdbcTemplate.update("insert into record(type_num,user_id,model) values(10,1,'label')");
    }

    public List<Record> show(Record record){
        String sql="select * from record where user_id = "+record.getUser_id();
        if(record.getId()!=-1 && record.getId()!=0){
            sql=sql+" and id="+record.getId();
        }
        if(record.getStart_date()!=null && record.getEnd_date()!=null){
            sql=sql+" and created_at between '"+record.getStart_date()+"' and '"+record.getEnd_date()+"'";
        }
        if(record.getStatus()!=-1){
            sql=sql+" and status = "+record.getStatus();
        }
        sql=sql+" order by created_at desc";
        List<Map<String,Object>> list=jdbcTemplate.queryForList(sql);
        List<Record> recordList=new ArrayList<>();
        for(Map<String,Object> map:list){
            Record record1=new Record();
            record1.setId((int) map.get("id"));
            record1.setType_num((int)map.get("type_num"));
            record1.setUser_id((int)map.get("user_id"));
            record1.setStatus((int)map.get("status"));
            record1.setModel((String)map.get("model"));
            record1.setMethod((String)map.get("method"));
            record1.setCreated_at(Timestamp.valueOf((LocalDateTime)map.get("created_at")));
            recordList.add(record1);
        }
        return recordList;
    }

    public int updateStatus(Record record){
        return jdbcTemplate.update("update record set status=1 where id=?",record.getId());
    }

    /*public List<Record> find(Record record){
        String sql="select * from record where user_id = "+record.getUser_id();
        if(record.getName()!=null){
            sql=sql+" and name like '%"+record.getName()+"%'";
        }
        if(record.getType()!=null){
            sql=sql+" and type = '"+record.getType()+"'";
        }
        if(record.getStatus()!=null){
            sql=sql+" and status = '"+record.getStatus()+"'";
        }
        List<Map<String,Object>> list=jdbcTemplate.queryForList(sql);
        List<Record> recordList=new ArrayList<>();
        for(Map<String,Object> map:list){
            Record record1=new Record();
            record1.setId((int) map.get("id"));
            record1.setType_num((int)map.get("type_num"));
            record1.setUser_id((int)map.get("user_id"));
            record1.setStatus((int)map.get("status"));
            record1.setCreated_at(Timestamp.valueOf((LocalDateTime)map.get("created_at")));
            recordList.add(record1);
        }
        return recordList;
    }*/

    public int delete(int id){
        return jdbcTemplate.update("delete from record where id=?",id);
    }
}
