set -eo pipefail
PROFILENAME=todd
S3Bucket=s3://dlivcom-source

datecmd() {
   arr=("$@")
   now=`date +"%Y-%m-%dT%H:%M:%S%:z"`
   echo $now ${arr[*]}
}

COMMANDSTRING=(cd dist)
datecmd "${COMMANDSTRING[@]}"
"${COMMANDSTRING[@]}"
COMMANDSTRING=(zip ../s3out/dliv.zip *)
datecmd "${COMMANDSTRING[@]}"
COMMANDSTRING=(cd ../)
datecmd "${COMMANDSTRING[@]}"
"${COMMANDSTRING[@]}"
COMMANDSTRING=(aws s3 cp s3out/dliv.zip $S3Bucket --profile $PROFILENAME)    
datecmd "${COMMANDSTRING[@]}"
"${COMMANDSTRING[@]}"