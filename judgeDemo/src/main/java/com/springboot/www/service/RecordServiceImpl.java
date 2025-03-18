package com.springboot.www.service;

import com.springboot.www.dao.RecordDao;
import com.springboot.www.entity.Record;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class RecordServiceImpl implements RecordService {
    @Autowired
    private RecordDao recordDao=new RecordDao();
    /*@Override
    public List<Record> find(Record record) {
        return recordDao.find(record);
    }*/
    @Override
    public List<Record> show(Record record) {
        return recordDao.show(record);
    }
    @Override
    public int add(Record record){ return recordDao.add(record);}
    @Override
    public int updateStatus(Record record){ return recordDao.updateStatus(record);}
    @Override
    public int delete(int id){
        return recordDao.delete(id);
    }

}
