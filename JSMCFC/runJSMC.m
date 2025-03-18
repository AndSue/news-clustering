%%
% This is a demo for the Jointly Smoothed Multi-view Subspace Clustering 
% (JSMC) algorithm. If you find it helpful in your research, please cite 
% the paper below.
%
% Xiaosha Cai, Dong Huang, Guangyu Zhang, Chang-Dong Wang. 
% Seeking Commonness and Inconsistencies: A Jointly Smoothed Approach to 
% Multi-view Subspace Clustering. Information Fusion, 2023, 91:364-375.
%
% DOI: 10.1016/j.inffus.2022.10.020
%%

function  label = runJSMC(X, cntCls, alpha,beta,lambda,gamma)
warning('off');
maxIters = 100;

nView = length(X);
nSample = size(X{1},2);%矩阵的列数=样本数
mu = 1;
knn = 5;
Y = zeros(nSample);%生成nSample*nSample的矩阵
S = zeros(nSample);%S=C
max_mu = 10^6;
rho = 1.5;
Obj = [];

%% Initialization
[L,G] = constructG(X, knn, nView, nSample);%L，W
[C,E,H,XX,sumXX,sumL]  = Initialization(X,L,G,nView, nSample);%E：初始化为0矩阵

%temp_inv = (XX{v} + beta*eye(n))\eye(n)
temp_inv = cell(1,nView);
for v = 1:nView
    temp_inv{v} = (XX{v} + beta*eye(nSample));%B\A=B^-1*A
end

%% Alternate minizing strategy
for t = 1:maxIters
    %------------- update S -------------
    S = solveS(sumL, C, E, H, Y, mu, alpha, gamma, nView, nSample);   %S=C，辅助变量
    SS = (S+eye(nSample))*(S'+eye(nSample));
    ISS = (eye(nSample)-S)*(S'-eye(nSample));
    %------------- update C -------------
    C = solveC(S, Y, mu, lambda);    %C：共同矩阵
    %------------- update H -------------
    H = solveH(sumXX, XX, SS, ISS, E, beta, gamma, nView, nSample);     %E:互补矩阵
    %------------- update E -------------
    E = solveE(XX, SS, ISS, H, temp_inv, gamma, nView);     %E:互补矩阵
    %------------- update Y -------------
    Y = Y + mu*(S-C);   %Y：拉格朗日乘子
    mu = min(max_mu,rho*mu);   
    
    %Compare the current iteration value with the previous iteration value
    Obj(t) = computeObjValue(X,C,E,L,H,alpha,beta,lambda,gamma,nView);
    if (t>1 && abs(Obj(t-1)-Obj(t))<10^-4)
        break;
    end    
end

%disp(log10(Obj))
%plot(1:20,log10(Obj));
%xlabel('Number of iterations','FontName','Times New Roman','FontSize',7);  %x轴坐标描述
%ylabel('lg(Obj.value)','FontName','Times New Roman','FontSize',7); %y轴坐标描述

W = (C'+C)/2;

%% output the final result
[label, ~] = SpectralClustering(W, cntCls);

%% 邻接矩阵
%imagesc(W);
%% 聚类散点图
%ydata=tsne(W,label);
% scatter(X(:, com(i, 1)), X(:, com(i, 2)), 'fill', 'r');
% hold on    
% scatter(Y(:, com(i, 1)), Y(:, com(i, 2)), 'fill', 'g');
% hold on
% scatter(Z(:, com(i, 1)), Z(:, com(i, 2)), 'fill', 'b');
