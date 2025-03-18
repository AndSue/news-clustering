function [Z,E,H,XX,sumXX,sumL] = Initialization(X,L,S,V, n)
%Z=C
%��ʼ��CΪ������ͼ��KNNͼ��ƽ��ֵ
%E�˴���ʼ��Ϊ0����
%S��KNNͼ
%XX=X^2
%% Initialization 
E = cell(1,V);%����1��V�е�Ԫ�����飬ÿ��Ԫ������һ������
XX = cell(1,V);
sumXX = zeros(n,n);
sumL = zeros(n,n);
sumS = zeros(n,n);
for v = 1:V    
    E{v} = zeros(n);
    XX{v} = X{v}' * X{v};
    sumXX = sumXX + XX{v};
    sumL = sumL + L{v};
    sumS = sumS + S{v};
end
Z = 1/V * sumS;
H = Z.*0;