function H = solveH(sumXX, XX, SS, ISS, E, beta,gamma,V, n)
A_syl = sumXX+beta*eye(n);
B_syl = gamma*SS;
C_syl = sumXX;
for v = 1:V
    C_syl = C_syl-XX{v}*E{v}+gamma*E{v}*ISS;
end
H = lyap(A_syl,B_syl,-C_syl);