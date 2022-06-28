gitlab_host="http://192.168.0.154"
gitlab_user="root"
gitlab_password="1q2w3e4r."

# curl for the login page to get a session cookie and the sources with the auth tokens
body_header=$(curl -c cookies.txt -i "${gitlab_host}/users/sign_in" -s)

# grep the auth token for the user login for
#   not sure whether another token on the page will work, too - there are 3 of them
csrf_token=$(echo $body_header | perl -ne 'print "$1\n" if /new_user.*?authenticity_token"[[:blank:]]value="(.+?)"/' | sed -n 1p)

# send login credentials with curl, using cookies and token from previous request
curl -b cookies.txt -c cookies.txt -i "${gitlab_host}/users/sign_in" \
    --data "user[login]=${gitlab_user}&user[password]=${gitlab_password}" \
    --data-urlencode "authenticity_token=${csrf_token}"

# send curl GET request to personal access token page to get auth token
body_header=$(curl -H 'user-agent: curl' -b cookies.txt -i "${gitlab_host}/-/profile/personal_access_tokens" -s)
csrf_token=$(echo $body_header | perl -ne 'print "$1\n" if /authenticity_token"[[:blank:]]value="(.+?)"/' | sed -n 1p)

# curl POST request to send the "generate personal access token form"
# the response will be a redirect, so we have to follow using `-L`
body_header=$(curl -L -b cookies.txt "${gitlab_host}/-/profile/personal_access_tokens" \
    --data-urlencode "authenticity_token=${csrf_token}" \
    --data 'personal_access_token[name]=golab-generated&personal_access_token[expires_at]=&personal_access_token[scopes][]=api')

# Scrape the personal access token from the response HTML
personal_access_token=$(echo $body_header | perl -ne 'print "$1\n" if /created-personal-access-token"[[:blank:]]value="(.+?)"/' | sed -n 1p)

#  > curl --header "Private-Token: ${personal_access_token}" http://192.168.0.154/api/v4/projects

#  > curl --request POST --header "PRIVATE-TOKEN: ${personal_access_token}" "http://192.168.0.154/api/v4/users?email=apiset@gmail.com&password=1q2w3e4r.&username=tester&name=tester&reset_password=false&skip_confirmation=true"

# skip email confirm - https://gitlab.com/gitlab-org/gitlab-foss/-/merge_requests/21630/diffs?commit_id=4668f5d49d491b73a8336b2131366e360f332a6d