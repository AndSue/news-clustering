import org.wltea.analyzer.core.IKSegmenter;
import org.wltea.analyzer.core.Lexeme;
import java.io.IOException;
import java.io.StringReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class IKAnalyzerUtil {

    public static List<String> cut(String msg) throws IOException {
        StringReader sr=new StringReader(msg);
        IKSegmenter ik=new IKSegmenter(sr, true);
        Lexeme lex=null;
        List<String> list=new ArrayList<>();
        while((lex=ik.next())!=null){
            list.add(lex.getLexemeText());
        }
        return list;
    }

    public static void main(String[] args) throws IOException {
        String text="中国太平成立九十周年了！中国太平！";
        List<String> list=IKAnalyzerUtil.cut(text);
        System.out.println(list);
        Map<String,Integer> frequent=new HashMap<>();
        for(String str:list){
            frequent.put(str,frequent.getOrDefault(str,0)+1);
        }
        List<Map.Entry<String,Integer>> frequencyList=frequent.entrySet().stream()
                .sorted(Map.Entry.<String,Integer>comparingByValue().reversed())
                .limit(5)
                .collect(Collectors.toList());
        System.out.println(frequencyList);
    }
}