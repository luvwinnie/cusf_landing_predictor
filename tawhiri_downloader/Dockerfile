FROM ubuntu:18.04
LABEL email="siang@artibrains.com"


ENV DEBIAN_FRONTEND=noninteractive
ENV PYTHONUNBUFFERED=1
# SHELL ["/bin/bash", "--login", "-c"]

RUN apt-get update
RUN apt-get install tzdata apt-utils locales dialog -y
RUN localedef -f UTF-8 -i ja_JP ja_JP.UTF-8
ENV TZ=Asia/Tokyo
ENV LC_ALL=ja_JP.UTF-8
RUN apt-get update --fix-missing && apt-get upgrade -y && \ 
    apt-get install -y supervisor python3 python3-pip git curl wget&& \
	apt-get install -y build-essential rsync git libpcre3-dev libncurses-dev pkg-config m4 unzip aspcud autoconf bubblewrap && \
	apt-get install -y libssl-dev libgmp-dev libffi-dev libeccodes-dev libcurl4-gnutls-dev && \
	apt-get clean && \
    rm -rf /var/lib/apt/lists/*
RUN curl -sL https://raw.githubusercontent.com/ocaml/opam/master/shell/install.sh > /install.sh
RUN chmod u+x /install.sh && yes '' | /install.sh
RUN mkdir /srv/tawhiri-datasets/ /srv/ruaumoko-dataset/


RUN opam init -y --disable-sandboxing github git+https://github.com/ocaml/opam-repository.git --compiler=4.11.0
# RUN eval $(opam env)
RUN eval $(opam env) && opam install -y  core=v0.14.0 async=v0.14.0 ctypes=0.18.0 ctypes-foreign ocurl=0.9.1
# RUN git clone https://github.com/cuspaceflight/tawhiri-downloader.git /tawhiri-downloader
# RUN git clone https://github.com/luvwinnie/tawhiri-downloader.git /tawhiri-downloader
COPY ./tawhiri-downloader /tawhiri-downloader
WORKDIR /tawhiri-downloader
RUN eval $(opam env) && cd /tawhiri-downloader && dune build --profile=release main.exe
# ENTRYPOINT ["eval", "$(opam env)",""]
ENTRYPOINT ["opam", "exec", "--"]
CMD ["/tawhiri-downloader/_build/default/main.exe","daemon"]
