package com.springboot.www;

import DiMvSCGE.Class1; // 这个是我们自己写的jarDemo.m函数
//import datatype.Class1;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.test.context.SpringBootTest;
import com.mathworks.toolbox.javabuilder.*; // 这个是必须的，对matlab的支持
//import com.mathworks.matlab.types.*;
public class matlabTest
{
    private static final Logger log = LoggerFactory.getLogger(matlabTest.class);
    @Test
    public void test1() {
        log.info("开始运行");
        try {
            Class1 t = new Class1();
            String[] str=new String[2];
            str[0]="组图：秘密花园 玄彬河智苑情侣装点燃情人节导语：韩剧《秘密花园》一经播出大受欢迎，播完后还是余温不减，甚至连很多平时不太看韩剧的MM们也随波逐流一追再追！男女主人公的扮演者玄彬和河智苑在剧中的打扮也背大家津津乐道，包括金莎朗、刘仁娜饰演的角色也是换装频繁。这里主要搜集了秘密花园中玄彬和河智苑共同出现的服饰搭配，还有女明星们的个人风格搭配，都是十分生活化又好看哒，为你点燃2011年的这个情人节！";
            str[1]="黄蜂vs湖人首发：科比带伤战保罗 加索尔救赎之战 新浪体育讯北京时间4月27日，NBA季后赛首轮洛杉矶湖人主场迎战新奥尔良黄蜂，此前的比赛中，双方战成2-2平，因此本场比赛对于两支球队来说都非常重要，赛前双方也公布了首发阵容：湖人队：费舍尔、科比、阿泰斯特、加索尔、拜纳姆黄蜂队：保罗、贝里内利、阿里扎、兰德里、奥卡福[新浪NBA官方微博][新浪NBA湖人新闻动态微博][新浪NBA专题][黄蜂vs湖人图文直播室](新浪体育)";
            str[2]="独家揭秘业主购买瓷砖为何不能上楼 新浪家居杨轶讯 近日，有很多消费者向本网反映：购买瓷砖，商家不能无条件送货上楼，需加收一定的费用，业主对此心存疑惑：购买瓷砖为什么不能送货上楼？为何要另加收费用才可享受送货到家服务？收费标准缘何如此混乱？【事件回顾】【参与网友讨论】         新浪家居特联合新京报发起大型调研：瓷砖该不该上楼，引起业内广泛关注。一方面消费者在抱怨建材企业服务不到位的同时，商家也透露背后难言之隐。【参与调查：瓷砖上楼真的那么难吗？】【家居议事厅26期：瓷砖该不该上楼】商家服务参差不齐 造成难能送货上楼                       图为阔达装饰董事长 曹安闽根据市场调研，以及跟一些商家沟通了解到，提供免费送货上楼服务，大部分的建材商都做不到，均需另收取费用。阔达装饰董事长曹安闽谈到：送货与否，与商家的利润率有很大关系，有利润的商家肯定愿意送货。【相关阅读：集采瓷砖可送货上楼 业主自购缘何不能】 ";

            //CellStr keySet = new CellStr(new String[]{"Jan","Feb","Mar","Apr"});
            String data=String.join("\n",str);
            String url="E:/1多视图聚类/2实验/MvSCEG/Code-for-MvSCGE-master-66";
            String[] labels= {"体育", "财经", "房产", "家居", "教育", "科技", "时尚", "时政", "游戏", "娱乐"};
            Object[] result = t.DiMvSCGE_label(2,data,2);
            //Object[] result = t.DiMvSCGE(1,"差评，园区环境又脏又差，服务还不好，下次再也不会来了！");
            //Object[] result = t.DiMvSCGE(1,"很不错！园区风景很漂亮，强烈推荐，值得来玩一玩！");
            log.info(result[0].toString());
            /*String[] results = result[0].toString().substring(1,result[0].toString().length()-1).split(" ");
            for (String obj : results){
                log.info(labels[Integer.parseInt(obj)]);
            }*/

        } catch (MWException e) {
            e.printStackTrace();
        }
        log.info("运行结束");
    }
}

