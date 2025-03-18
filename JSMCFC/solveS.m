function S = solveS(sumL,C,E,H,Y,mu,alpha,gamma,V,n)
%AS+SB=C
A_syl = mu*eye(n);
B_syl = 2*alpha*sumL;
C_syl = mu*C - Y;
for v=1:V
    Z = H+E{v};
    ZZ = Z'*Z;
    A_syl = A_syl + 2*gamma*ZZ;
    C_syl = C_syl + 2*gamma*ZZ*(eye(n) - E{v});
end
S = lyap(A_syl,B_syl,-C_syl);%求解式为AS+SB=-C