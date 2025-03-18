function [Z,E,H,XX,sumXX,sumL] = Initialization(X,L,S,V, n)
%Z=C
%初始化C为所有视图的KNN图的平均值
%E此处初始化为0矩阵
%S：KNN图
%XX=X^2
%% Initialization 
E = cell(1,V);%创建1行V列的元胞数组，每个元胞都是一个矩阵
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