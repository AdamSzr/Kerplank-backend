FROM amazoncorretto:17

COPY target/adam-kerplank.jar /
EXPOSE 8885
WORKDIR /
RUN echo $PATH
CMD ["java", "-Dfile.encoding=UTF-8", "-jar", "adam-kerplank.jar"]
