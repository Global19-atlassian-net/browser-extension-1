import React, { useEffect } from "react"
import Container from "@material-ui/core/Container"
import Link from "@material-ui/core/Link"
import { Link as RouterLink } from "react-router-dom"
import { Paths } from "../components/routes/paths"
import { withLayout } from "../components/layout"
import { useCallAsync } from "../utils/notifications"
import { useBackground } from "../context/background"
import Card from "@material-ui/core/Card"
import CardContent from "@material-ui/core/CardContent"
import { Typography } from "@material-ui/core"
import TextField from "@material-ui/core/TextField"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import Checkbox from "@material-ui/core/Checkbox"
import CardActions from "@material-ui/core/CardActions"
import Button from "@material-ui/core/Button"

interface LockWalletPageProps {}

const LockWalletPageBase: React.FC<LockWalletPageProps> = () => {
  const callAsync = useCallAsync()
  const { request } = useBackground()

  useEffect(() => {
    callAsync(request("popup_lockWallet", {}), {
      progressMessage: "locking wallet...",
      successMessage: "Wallet locked",
    })
  }, [])

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Your wallet is locked
        </Typography>
      </CardContent>
      <CardActions style={{ justifyContent: "flex-end" }}>
        <Button color="primary" component={RouterLink} to={Paths.account}>
          Unlock
        </Button>
      </CardActions>
    </Card>
  )
}

export const LockWalletPage = withLayout(LockWalletPageBase)