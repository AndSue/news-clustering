clear all;
warning off;

dataName='bbcsport_seg14of4';
load([dataName,'.mat']);
for v=1:length(X)
    X{v} = X{v}';
end
gt=Y;

maxIters = 100;
lambda = 0.01;
beta = 0.0007;
alpha = 5;
C = size(unique(gt),1);

disp(['dataset = ',dataName]);

result = MvSCGE_solver(X, C, lambda, beta, alpha, maxIters, gt);
disp('NMI Fscore P ACC PUR =');
disp(result);

