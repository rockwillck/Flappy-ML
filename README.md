# Flappy ML
### A weekend project
This is a bare bones example of a generative machine learning algorithm. Each "bird" (yellow square) starts off with a random set of instructions - wait 5 frames before flapping, then 1, then 3, then 5, etc. etc.  
We then take the top 2.5% performers of each generation and create a new generation made up of different mutations of that top 2.5%. We run this process over and over.  
Eventually, this will give positive results, but in this case, the algorithm is still finicky and takes a very long time to make significant process. The original seed of the obstacle spawner also has an effect.  