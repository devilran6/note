扩散模型



!!! info
    最早是在2015年的一篇论文重初见端倪的

    [Deep Unsupervised Learning using Nonequilibrium Thermodynamics](https://proceedings.mlr.press/v37/sohl-dickstein15.html)
    
    是在2020年的论文发出后开始流行的(具有突破性进展)
    
    [Denoising Diffusion Probabilistic Models](https://proceedings.neurips.cc/paper/2020/hash/4c5bcfec8584af0d967f1ab10179ca4b-Abstract.html)


## 前置知识

### 高斯分布

**各向同性的高斯分布**

各向同性的高斯分布（Isotropic Gaussian Distribution）是一种特殊的高斯分布（也叫正态分布），在这种分布中，所有维度（或方向）的标准差都是相同的。也就是说，在多维空间里，这种分布从它的中心点（均值）向外扩散的“速度”或“范围”在所有方向上都是一样的。

数学上，各向同性的多维高斯分布可以用下面的公式表示：
$$
p(x) = \frac{1}{(2\pi)^{n/2} \sigma^n} e^{-\frac{||x - \mu||^2}{2\sigma^2}}
$$

其中，

- x  是一个 n 维向量。
- $\mu$ 是 n 维均值向量。
- $\sigma$ 是所有维度上相同的标准差。
- $||x - \mu||^2$ 表示 x 和 $\mu$ 之间的欧氏距离的平方。

在各向同性的高斯分布中，协方差矩阵（Covariance Matrix）是一个对角矩阵，而且对角线上的元素都是 $\sigma^2$，表示所有维度都有相同的方差。

这种分布在机器学习和数据科学中经常用作简化假设或者生成数据。因为它在所有方向上都有相同的特性，所以计算和推理通常会更简单。


**两个高斯分布的和仍然是一个高斯分布**


如果我们需要投掷两次骰子的话

一个骰子投两次 == 投一次两个骰子

把两个单独的概率 合成 一次两个合并的概率

在图片这里是将两个高斯分布 合成 ==> 仍然是高斯分布

$$
\begin{equation}
N(0, \sigma_1^2I) + N(0, \sigma_2^2I) \sim N(0, (\sigma_1^2 + \sigma_2^2)I)
\end{equation}
$$

### 贝叶斯公式

P(ABC) == P(C|BA)P(BA) == P(C|BA)P(B|A)P(A)

P(BC|A) == P(B|A)P(C|AB)


!!! info
    **第二个式子的推导**

    P(ABC) == P(C|BA)P(BA) == P(C|BA)P(B|A)P(A)

    P(ABC) == P(BC|A)P(A)

    ==> P(C|BA)P(B|A)P(A) == P(BC|A)P(A)

    两边消去P(A)

    ==> P(BC|A) == P(B|A)P(C|AB)



### 马尔科夫链

!!! tip
    "The future is independent of the past given the present!"

    未来独立于过去，只基于当下。

[简述马尔可夫链【通俗易懂】](https://zhuanlan.zhihu.com/p/448575579)

[马尔科夫链（Markov Chain），机器学习和人工智能的基石](https://www.toutiao.com/article/6669798537494004227/)


**基于马尔科夫假设的条件概率**

即当前时刻的概率分布**只**与上一时刻有关

如果满足马尔科夫链关系A->B->C，那么有

P(ABC) == P(C|BA)P(BA) == P(C|B)P(B|A)P(A)

P(BC|A) == P(B|A)P(C|B)

!!! info
    因为C的上一个时间点是B，所以A对C的影响被忽略

### 重参数化技巧

$$
\begin{equation}
z \sim N(z, \mu, \sigma^2 I) \Rightarrow z = \mu + \sigma *\epsilon, \epsilon \sim N(0, I)
\end{equation}
$$


目的: 方便计算 and 采样过程可导

不直接从分布$N(\mu, \sigma^2 I)$中采样z，而是先从标准正态分布$N(0, I)$中采样一个随机噪声$\epsilon$，然后使用$\epsilon$来计算z。这样就将一个不可导的采样过程转化为了一个可导的计算过程。

!!! question
    为什么这样操作后就可以变得可导?

    重参数化技巧的核心是将随机性从参数中分离出来，从而使得模型的某些部分变得可导。可以通过以下几点来理解为什么经过重参数化技巧后，模型变得可导：
    
    1. **分离随机性**：在没有使用重参数化技巧之前，我们直接从参数化的分布（如$N(\mu, \sigma^2 I)$）中采样。这个采样过程是不可导的，因为它涉及到随机性。但是，重参数化技巧将这种随机性转移到了一个固定的分布（如标准正态分布$N(0, I)$）中，这样我们就可以将随机性与参数分离。
    
    2. **可导的变换**：重参数化技巧引入了一个可导的变换$z = \mu + \sigma *\epsilon$。这里，$\epsilon$是**从一个固定的分布（如$N(0, I)$）中采样的**，而$\mu$和$\sigma$是模型的参数。这个变换是完全可导的，因为它只涉及到简单的加法和乘法操作。
    
    3. **梯度传播**：由于上述的变换是可导的，我们可以计算关于$\mu$和$\sigma$的梯度。这意味着，当我们使用梯度下降方法来优化模型的参数时，梯度可以顺利地从模型的输出传播到$\mu$和$\sigma$。
    
    4. **保持随机性**：虽然我们将随机性从参数中分离出来，但模型的输出仍然是随机的，因为它依赖于随机采样的$\epsilon$。这意味着模型仍然可以捕捉到数据的随机性。
    
    重参数化技巧通过将**随机性**从**参数**中**分离**出来，并引入一个可导的变换，使得模型变得可导。这使得可以使用基于梯度的优化方法来训练模型，同时仍然保持模型的随机性。

### Jensen不等式

[碎片化学习之数学（一）：Jensen不等式](https://zhuanlan.zhihu.com/p/57961533)

若$f(x)$是区间$[a,b]$上的凸函数,则对任意的$x_1, x_2, \cdots, x_n \in [a, b]$,则有


$$
\begin{align}
&f(\sum_{i=1}^{n}{\frac{x_i}{n}}) \geq \frac{\sum_{i=1}^n{f(x_i)}}{n}
\\
\Rightarrow \quad &f(E(x)) \geq E(f(x)) 
\end{align}
$$

### KL散度  

$$
\begin{align}
KL(p||q) = \sum{p(x)log(\frac{p(x)}{q(x)})}
\end{align}
$$

正态分布的KL散度:

$$
\begin{align}
D_{KL}(N(\mu_1, \sigma_1^2) || N(\mu_2, \sigma_2^2)) = log\frac{\sigma_2}{\sigma_1} + \frac{\sigma_1^2+(\mu_1-\mu_2)^2}{2\sigma_2^2} - \frac{1}{2}
\end{align}
$$


## 扩散模型

扩散模型是由前向扩散和逆向扩散这两个部分组成的。

前向扩散：

逐步的给输入图像添加高斯噪声，每一次添加高斯噪声，图像便会损失一定的信息。当次数足够多时候，图像会收敛于高斯分布

逆向扩散：

从白噪声中一步步的学习去除噪声，直到得到一张清晰的图像 

### 前向扩散

$x_t$ 表示添加了t次噪声后的图像

$$
\begin{align}
q(x_t|x_{t - 1}) &= N(x_t, \sqrt{1-\beta_t}x_{t - 1}, \beta_t I) \quad \beta_t \in (0, 1)
\\
q(x_T|x_0) &= \prod_{t = 1}^{T}{q(x_t|x_{t - 1})}
\end{align}
$$


通过计算可以去除递归,直接通过$x_0$计算得到$x_T$

(详细推导略 Todo)

$$
\begin{align}
&定义:\alpha_t=1-\beta_t, \overline{\alpha_t} = \prod_{i = 1}^{t}{\alpha_s} 
\\
x_t &= \sqrt{1-\beta_t}x_{t - 1} + \sqrt{\beta_t} * \epsilon \\
    &= \sqrt{\alpha_t}x_{t - 1} + \sqrt{1-\alpha_t} * \epsilon \\
    & ... \\
    &= \sqrt{\overline{\alpha_t}}x_0 + \sqrt{1-\overline{\alpha_t}}I
\end{align}
$$

可以得到

$$
\begin{align}
q(x_t|x_0) &= N(x_t, \sqrt{\overline{\alpha_t}}x_0, 1 - \overline{\alpha_t}I) \\
\lim_{t \to \infty} q(x_t|x_0) &= N(0, I) \\
\lim_{t \to \infty} q(x_t) &= N(0, I) \\
\end{align}
$$



### 逆向扩散

现在希望将前向过程中的操作反过来,这样就可以将高斯分布$x_T$一步步的推到$x_0$

但是我们是没有办法得到从$x_t$到$x_{t-1}$的这个分布的 

所以我们需要一个神经网络(深度学习),去学习一个参数化的高斯分布$p_{\theta}(x_{t-1}|x_t)$,来近似这个逆向扩散的过程 

---

首先通过$x_t和t$预测出$\epsilon_\theta(x_t,t)$

之后计算出 $\mu_\theta$ 和 $\overset{\sim}{\beta_t}$

进一步得到 

$$
\begin{align}
p_\theta(x_{t-1}|x_t) = N(x_{t-1}, \mu_\theta(x_t, t), \sigma_\theta(x_t, t_tI))
\end{align}
$$

进而得到$x_{t-1}$

!!! question
    为什么得到$p_\theta(x_{t-1}|x_t)$后就能得到$x_{t-1}$?


    这里描述的是逆向扩散的一个具体步骤，其中$x_t$表示在时间$t$的数据状态，而$x_{t-1}$表示在时间$t-1$的数据状态。我们的目标是从$x_t$回溯到$x_{t-1}$。
    
    1. **预测$\epsilon_\theta(x_t,t)$**：这是一个噪声项，通常由一个参数为$\theta$的模型预测，它考虑了当前的数据状态$x_t$和时间$t$。
    
    2. **计算$\mu_\theta$ 和 $\overset{\sim}{\beta_t}$**：这些是条件分布的参数，它们描述了从$x_t$到$x_{t-1}$的转换。具体来说，$\mu_\theta$是均值，而$\overset{\sim}{\beta_t}$与方差或标准差有关。
    
    3. **得到$p_\theta(x_{t-1}|x_t)$**：这是一个条件分布，描述了给定$x_t$时$x_{t-1}$的概率分布。它是一个正态分布，均值为$\mu_\theta(x_t, t)$，方差为$\sigma_\theta(x_t, t_tI)$。
    
    4. **从$p_\theta(x_{t-1}|x_t)$采样$x_{t-1}$**：一旦我们有了$x_{t-1}$的条件分布，我们就可以从中采样得到$x_{t-1}$的实际值。这是通过标准的概率采样方法完成的，例如使用蒙特卡洛方法或其他采样技术。
    
    为什么这样做可以得到$x_{t-1}$呢？因为$p_\theta(x_{t-1}|x_t)$给出了在给定$x_t$的情况下$x_{t-1}$的所有可能值的概率分布。通过从这个分布中采样，我们可以得到一个可能的$x_{t-1}$值，这个值是与$x_t$一致的，并且是在时间$t-1$的最可能状态。



#### 目标函数 and 优化上界

$$
\begin{align}
L = E_{q(x_0)}[-log(p_\theta(x_0))]
\end{align}
$$


- 通过Jensen不等式, 将问题转化为优化上界

(详细推导略 Todo)

$$
\begin{align}
L_{simple} = E_{x_0 \sim q(x_0), \epsilon \sim N(0, I)}[\Vert\epsilon-\epsilon_\theta(\sqrt{\overline{\alpha_t}}x_0 + \sqrt{1-\overline{\alpha_t}}\epsilon, t)\Vert^2]
\end{align}
$$

## 其他


!!! warning "Reference"

    - 论文 
        -  [Deep Unsupervised Learning using Nonequilibrium Thermodynamics](https://proceedings.mlr.press/v37/sohl-dickstein15.html)
        -  [Denoising Diffusion Probabilistic Models](https://proceedings.neurips.cc/paper/2020/hash/4c5bcfec8584af0d967f1ab10179ca4b-Abstract.html)
    - 视频
        - [大白话AI | 图像生成模型DDPM | 扩散模型 | 生成模型 | 概率扩散去噪生成模型](https://www.bilibili.com/video/BV1tz4y1h7q1/?spm_id_from=333.999.0.0)
        - [54、Probabilistic Diffusion Model概率扩散模型理论与完整PyTorch代码详细解读](https://www.bilibili.com/video/BV1b541197HX/?spm_id_from=333.999.0.0)
        - [扩散模型/Diffusion Model原理讲解](https://www.bilibili.com/video/BV1PY411Z74Z/?spm_id_from=333.1007.top_right_bar_window_custom_collection.content.click&vd_source=664d223fe65c6706d11206b7416f5b92)
      
    - 文章
        - [Diffusion Model原理解析](https://zhuanlan.zhihu.com/p/539283420)