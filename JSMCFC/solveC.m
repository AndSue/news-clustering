function C = solveC(S, Y, mu, lambda)
temp = S + Y/mu;
[Uc,Sigmac,Vc] = svd(temp,'econ');%非负矩阵分解
sigma = diag(Sigmac);%奇异值从大到小排列
svp = length(find(sigma > (lambda/mu)));%find：返回有非零元素的位置（竖着数）
if svp >1
    sigma =sigma(1:svp,1)-(lambda/mu);
else
    svp =1;
    sigma = 0;
end
C = Uc(:,1:svp)*diag(sigma)*Vc(:,1:svp)';
