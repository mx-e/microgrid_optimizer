#/!/bin/bash
MODEL=$1

julia $MODEL/microgrid_model_v2.jl
sleep 0.5s

echo model computation succesful \!



