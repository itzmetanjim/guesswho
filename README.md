Guess Who? Simulator
====================

The optimal strategy for Guess Who (or number guessing game) is NOT binary search!
----------------------------------------------------------------------------------

...unlike what common wisdom or this [one particular Mark Rober video](https://www.youtube.com/shorts/l9tOJy-IAvM) suggests.

Based on [this research paper arXiv:1509.03327v3](https://arxiv.org/abs/1509.03327)

Here, you can play against the computer (playing the optimal strategy)

If for some reason you want to know what the computer choose, check console log.

If you do not do that, then the computer will win against binary search (mark rober strategy) $86.05\%$ of the time. (bounds 100)

In a best of 5 that works out to an $97.82\%$ winrate against Mark Rober!

The optimal strategy
====================

Let $b^*(n,m)$ be the optimal "bid size" (how many numbers should the question contain) for player 1, where player 1 has $n$ numbers remaining and player 2 has $m$ numbers remaining.

Let $p^*(n,m)$ be the probability that player 1 will win if both players are using the optimal strategy and player 1 has $n$ numbers remaining and player 2 has $m$ numbers remaining.

If $n\ge2^{k+1}+1$ while $2^k+1\le m\le2^{k+1}$ for some $$ (i.e. $k=\lfloor\log_2(m-1)\rfloor$), then player 1 is in the weeds and must make a bold move to catch up!

$b^*(n,m)=2^k$ or $2^{\lfloor\log_2(m-1)\rfloor}$

$p^*(n,m)=\frac{2^{k+1}}{n}-\frac{2}{3}\cdot\frac{2^{2k+1}+1}{nm}$

If $2^k+1\le n\le2^{k+1}$ while $2^k+1\le m\le2^{k+1}$ for some $$, then player 1 has the upper hand an can afford to do low-risk moves

$b^*(n,m)=\lfloor\frac{n}{2}\rfloor$

$p^*(n,m)=1-\frac{2^k}{m}+\frac{2}{3}\cdot\frac{2^{2k}+2}{nm}$

Proof
=====

$p^*$ and $b^*$ satisfy the following recurrence relation

$p^*(n,m)=\max_{b\in\left[1,n-1\right]}\left\{1-\frac{b}{n}p^*(m,b)-\frac{n-b}{n}p^*(m,n-b)\right\}$

$b^*(n,m)=\arg\max_{b\in\left[1,n-1\right]}\left\{1-\frac{b}{n}p^*(m,b)-\frac{n-b}{n}p^*(m,n-b)\right\}$

*If the argmax is not unique, any $b$ that maximizes the function will work for the optimal strategy*

If this seems confusing,

-   the first equation says that the probability of you winning is 1 minus the probability of the other person winning.

-   it then expands the "probability of other person losing" into the probability of them winning into "probability of winning if the answer is yes" and "probability of winning if the answer is no"

-   then it multiplies those by the probabilty of there being a yes or no answer respectively

-   finally, the $\max$ operator is added to find the case where the bid size is optimized for the highest probability of winning

-   for the other equation, the difference is it uses an $\arg\max$ instead of a $\max$. this returns the value of $b$ in the optimal case instead of the probability

Using these, we can enter the equations into a computer to solve it numerically. Then a huge proof by induction is needed to prove that this guess is correct (you can see the entire proof in the accompanying paper).

*

(yes it is that unsatisfying sorry)

*
