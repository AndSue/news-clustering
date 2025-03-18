clear all;

addpath(genpath('E:\1多视图聚类\6223110011张悦辰\小论文1\代码\tools'));

load('3Sources.mat');

K = numel(unique(gt)); % number of clusters

%parameters
alpha = 0.02;
beta = 100;
lambda = 10;
gamma = 10;

disp('Start running the JSMCFC algorithm...');

label = runJSMC(X, K, alpha, beta, lambda, gamma);
nmi = NMImax(label,gt);
result = Clustering8Measure(label,gt);
disp(['NMI Fscore Precision Recall AR ACC PUR Entropy = ',num2str(nmi),' ', num2str(result(1)),' ',num2str(result(2)),' ',num2str(result(3)),' ',num2str(result(4)),' ',num2str(result(5)),' ',num2str(result(6)),' ',num2str(result(7))]);