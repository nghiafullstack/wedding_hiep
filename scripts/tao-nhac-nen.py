# Bản nhạc gốc: valse hộp nhạc Đô trưởng, 32 ô nhịp, lặp liền mạch
import numpy as np
import wave
SR=44100; BPM=84; BEAT=60/BPM; BAR=3*BEAT
mf=lambda m: 440*2**((m-69)/12)

CH={'C':(60,64,67),'Am':(57,60,64),'F':(53,57,60),'G':(55,59,62),'Em':(52,55,59),'Dm':(50,53,57)}
A=[('C',[(0,1,76),(1,1,79),(2,1,84)]),('Am',[(0,1.5,83),(1.5,.5,81),(2,1,76)]),
   ('F',[(0,1,77),(1,1,81),(2,1,84)]),('G',[(0,2,86),(2,1,83)]),
   ('C',[(0,1,84),(1,1,88),(2,1,79)]),('Em',[(0,1.5,83),(1.5,.5,79),(2,1,76)]),
   ('F|G',[(0,1,81),(1,1,84),(2,1,83)]),('C',[(0,3,84)])]
A2=A[:6]+[('F|G',[(0,1,81),(1,1,86),(2,1,83)]),('C',[(0,2,84),(2,1,79)])]
B=[('Am',[(0,1,81),(1,1,84),(2,1,88)]),('F',[(0,1.5,89),(1.5,.5,88),(2,1,84)]),
   ('C',[(0,1,88),(1,1,86),(2,1,84)]),('G',[(0,2,86),(2,1,79)]),
   ('Am',[(0,1,84),(1,1,88),(2,1,93)]),('F',[(0,1,91),(1,1,89),(2,1,81)]),
   ('Dm|G',[(0,1,89),(1,.5,88),(1.5,.5,86),(2,1,83)]),('C',[(0,3,84)])]
song=A+A2+B+A2
L=int(len(song)*BAR*SR)
out=np.zeros(L+SR*4)

def box(f,dur,vel):
    n=int(min(dur+2.2,4)*SR); t=np.arange(n)/SR
    s=(np.exp(-t*2.6)*np.sin(2*np.pi*f*t)+0.32*np.exp(-t*5.5)*np.sin(2*np.pi*2*f*t)
       +0.10*np.exp(-t*9)*np.sin(2*np.pi*3.01*f*t)+0.05*np.exp(-t*55)*np.sin(2*np.pi*5.43*f*t))
    s*=np.minimum(1,t/0.003)
    return vel*s
def pad(fs,dur):
    n=int((dur+0.8)*SR); t=np.arange(n)/SR
    env=np.minimum(1,t/0.6)*np.minimum(1,np.maximum(0,(dur+0.8-t)/0.8))
    return 0.045*env*sum(np.sin(2*np.pi*f*t)+0.3*np.sin(2*np.pi*2*f*t+0.3) for f in fs)
def add(sig,at):
    i=int(at*SR); out[i:i+len(sig)]+=sig

rng=np.random.default_rng(7)
for b,(ch,mel) in enumerate(song):
    t0=b*BAR
    parts=ch.split('|'); chords=[parts[0]]*3 if len(parts)==1 else [parts[0],parts[0],parts[1]]
    for beat in range(3):
        c=CH[chords[beat]]
        note=c[0] if beat==0 else c[beat]+12
        add(box(mf(note),BEAT,0.22 if beat==0 else 0.14),t0+beat*BEAT)
    for c in sorted(set(chords),key=chords.index):
        span=chords.count(c)*BEAT; st=chords.index(c)*BEAT
        add(pad([mf(m) for m in CH[c]],span),t0+st)
    for (o,d,m) in mel:
        human=rng.normal(0,0.008)
        add(box(mf(m),d*BEAT,0.42+rng.uniform(-.04,.04)),t0+o*BEAT+0.02+human)

def fftconvolve(a,b):
    n=len(a)+len(b)-1; N=1<<(n-1).bit_length()
    return np.fft.irfft(np.fft.rfft(a,N)*np.fft.rfft(b,N),N)[:n]

# vòng lặp: cộng đuôi vang vào đầu bài
dry=out[:L].copy(); dry[:len(out)-L]+=out[L:]
def ir(seed):
    r=np.random.default_rng(seed); n=int(2.4*SR); t=np.arange(n)/SR
    return r.standard_normal(n)*np.exp(-t*2.6)*0.012
st=[]
for seed in (1,2):
    wet=fftconvolve(dry,ir(seed))
    w=wet[:L].copy(); tail=wet[L:L+int(2.4*SR)]; w[:len(tail)]+=tail[:len(w)]
    st.append(dry*0.82+w*0.9)
y=np.stack(st,1)
y/=np.max(np.abs(y))/0.7
import sys
w=wave.open(sys.argv[1] if len(sys.argv)>1 else 'nhac-nen.wav','wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
w.writeframes((y*32767).astype('<i2').tobytes()); w.close()
print('len %.1fs'%(L/SR))
